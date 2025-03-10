---
outline: deep
---

### 透明代理

透明代理有两点需要满足：

1. 对于client透明，client不需要知道代理，只发出请求，这点需要网关来拦截实现
2. 对于server透明，server看到的报文源地址是client的，这点是nginx和socks代理软件无法做到的

但对于第二点，也许可以不用做到，就是半透明代理吧，只是对于client透明。

TODO: v2ray是哪种？发出原始源地址请求需要bind地址然后发出吗，那么回复包如何处理呢？

### iptables DNAT REDIRECT TPROXY三种方式

#### **区分proxy与nat**

正常的SNAT和DNAT都是在网关进行，如果是snat，那么一次发送的过程只修改一次源地址，一次接收修改一次目的地址，但如果是在同一网段非网关进行，那就是proxy，A要通过B访问C，但是B不是A的网关，那么B需要同时修改A的目的地址和源地址才能访问到C，这种情况貌似不能通过iptables来实现，只能用nginx或者v2ray，因为相当于重新生成包发送了，而不是修改包的信息。

在nat中，网关已经有了正确的目的地址了，而在proxy中，不仅要修改目的地址还要修改源地址，甚至内容可能也要改，不如重新生成一个包。

#### **DNAT**

在路由决定前修改包的目的ip或者目的端口，通过直接修改包的ip或者tcp首部

无论什么nat，nat的过程都是一对的，有dnat和snat，除非只需要单向通信

masquerade是特殊的snat，指定网卡后即使网卡的ip地址变化也会生效，同时会自动完成DNAT

**只是用于配置SNAT的话，我们并不用手动的进行DNAT设置，iptables会自动维护NAT表，并将响应报文的目标地址转换回来**

> **Both SNAT and DNAT do address translation both for incoming and outgoing packages**,using the connection tracking (conntrack) facility of the kernel. So if the kernel detects that a packet in the reverse direction belongs to a NATed connection, it will do the reverse translation automatically, without a special rule for it.

代理服务器收到客户端请求后，可以通过调用 getsockopt 的 `SO_ORIGINAL_DST` 参数拿到原始请求的目的地址。REDIRECT同理。

#### **REDIRECT**

> Here, incoming packets matching the rule have their destination address changed to the **receiving interface’s address** and optionally their destination port changed to a specific or a random port (depending on the command). Similar to DNAT, the IP (and probably transport layer) header is modified.

一般只涉及端口，不涉及ip的修改，就是特殊的DNAT，与DNAT相比不需要ip这个参数，所以维护配置更加灵活一些。

用nc实测不需要配置回复包的iptables规则：
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

#### **TPROXY**

> To sum up this a bit: IP_TRANSPARENT socket option makes it possible to assign an IP address to a socket regardless of whether it is assigned to any of the network interfaces on our machine or not. **None of these require connection tracking nor ip forwarding option set in the kernel, because the packets are not forwarded, their payload is only copied from one socket to another.**

> TPROXY 与 REDIRECT 是针对 TCP 而言的两种透明代理模式，两者的差异主要在于 TPROXY 可以透明代理 IPV6，而 REDIRECT 不行

实际两者都可以代理udp

通过getsockname拿到原始目的地址

##### tproxy拦截功能实现流程

首先一个包发到网关，网关需要进行拦截，先要通过iptables的prerouting链，再经过路由决策

所以需要先在prerouting链使用-j tproxy，并打上标签，然后在路由策略里就让打上标签的都不转发，而是发送到lo上，从而能被接收

如果要进行分流，比如说某台主机透明代理，其他主机正常转发，那么估计要使用iptables模块来控制，也可以使用dport来让访问任意地址这个端口的请求被代理，比如代理dns请求

iptables -t mangle -A PREROUTING -p tcp --dport 25 -j TPROXY \
 --tproxy-mark 0x1/0x1 --on-port 10025 --on-ip 127.0.0.1
这里的on代表tproxy将把包发到的地址，0x1是十六进制

这里用到了额外的路由表来实现，而不是直接将0.0.0.0/0的流量路由到local，是因为那样会导致这台机器无法发出任何请求到其他机器

##### rp_filter

反向路径过滤是 Linux 内核的一种安全机制，用于验证接收到的数据包的源地址是否可以通过该数据包到达的接口反向路由回去。其目的是防止 IP 地址欺骗攻击（如 DDoS 攻击中的伪造源 IP）。

但是在tproxy使用时，设置sysctl net.ipv4.conf.eth0.rp_filter=0来关闭，原因是包通过eth0进入，但是通过lo出去了，也可以设置为2，来保证安全性

这个决策是在路由策略时

#### 透明代理tproxy优化

这里socket模块是让本地请求（在本地存在socket）的回复包不走tproxy，走lo再匹配到本地socket直接到代理程序

如果还要做全局代理，那么这里是有问题的，需要删掉

```sh
iptables -t mangle -N DIVERT
iptables -t mangle -A DIVERT -j MARK --set-mark 1
iptables -t mangle -A DIVERT -j ACCEPT

iptables -t mangle -A PREROUTING -p tcp -m socket -j DIVERT
iptables -t mangle -A PREROUTING -p tcp --dport 25 -j TPROXY \
  --tproxy-mark 0x1/0x1 --on-port 10025 --on-ip 127.0.0.1
iptables -t mangle -A PREROUTING -p tcp --dport 80 -j TPROXY \
  --tproxy-mark 0x1/0x1 --on-port 10080 --on-ip 127.0.0.1
```

#### 透明代理 and 全局代理

TODO: output链处理；全局代理在windows上如何实现

tproxy方式：

redirect方式：

```sh
# 创建自定义链
iptables -t nat -N PROXY

# 忽略代理服务器和本地流量
iptables -t nat -A PROXY -d 0.0.0.0/8 -j RETURN
iptables -t nat -A PROXY -d 10.0.0.0/8 -j RETURN
iptables -t nat -A PROXY -d 127.0.0.0/8 -j RETURN
iptables -t nat -A PROXY -d 192.168.0.0/16 -j RETURN
iptables -t nat -A PROXY -d proxy_ip -j RETURN

# 重定向 TCP 流量到 redsocks 端口（假设 redsocks 监听 12345）
iptables -t nat -A PROXY -p tcp -j REDIRECT --to-ports 12345

# 应用规则到 OUTPUT 链
iptables -t nat -A OUTPUT -p tcp -j PROXY
```

### conntrack

conntrack会记录tcp和udp的连接信息，nat的信息全都会记录，可以手动增删

### SNMP udp端口转发实践iptables

```bash
# NAT 表规则
# 161 -> 16161
iptables -t nat -A PREROUTING -p udp --dport 161 -j DNAT --to-destination :16161
# 16161 -> 161 这条实测不需要添加
iptables -t nat -A POSTROUTING -p udp --sport 16161 -j SNAT --to-source :161

# Filter 表规则
# 安全加固，只能已经DNAT转换并且到16161的才能放通，禁止直接访问16161
iptables -A INPUT -p udp --dport 16161 -m conntrack --ctstate DNAT -j ACCEPT

# redirect可以实现吗 实践可以
iptables -t nat -A PREROUTING -p udp --dport 161 -j REDIRECT --to-ports 16161
```

### ip rule && ip route

最外层是路由策略数据库，有三条默认规则，这些策略规则用于匹配条件选择不同的路由表，通过ip rule来指定

linux可以定义252张路由表，有几张是系统定义的，这些路由表中的规则通过ip route来指定

路由表中最常见的local和main，localhost的请求直接走local表，因为优先级高于main表

### IP_TRANSPARENT 与 0.0.0.0

监听0.0.0.0，可以接受任意本地ip地址的包，不需要流量拦截

使用IP_TRANSPARENT，可以接受任意包，需要CAP_NET_ADMIN，并且需要流量拦截机制

### raw socket

搜索了一下，发现raw socket是可以允许进程自己配置包的header和payload，分L3和L2的raw socket，而一般的socket只能配置payload，header交给kernel配置

### http_proxy socks_proxy

http天然支持代理，只需要转发回复就行，因为http报文中只靠Host来通信，不关心其他层

### v2ray

#### dns

**作用总结**

1. freedom的domainStrategy不为AsIs时，使用内置dns解析
2. outbound为DNS时，提供dns服务，这里是接收dns请求报文，回复dns报文
3. 在routing部分的domainStrategy不为AsIs时，使用内置dns来解析，接收域名，提供ip，用于匹配

go语言如果是使用socks_proxy作为transport默认不会进行本地dns请求，通过httptrace库的dns hook可以测试，但是可以预先进行dns解析，再用ip访问，所以代理不应该预设dns请求一定会经过

v2ray的dns模块也有匹配规则，比如domains，当匹配上规则后才用对应的dns服务器，并且也有expectIPs来对结果过滤，如果没匹配则用下一个

并且需要注意的是dns模块发出请求，可以被routing中的规则匹配，会出现需要dns来解析，又将dns请求进行匹配的情况

**dns分流**

如下，是内置dns模块的dns服务器选择策略，而routing模块可以对dns请求进行outbound选择

```json
{
  "dns": {
    "servers": [
      {
        "address": "119.29.29.29",
        "port": 53,
        "domains": ["geosite:cn"],
        "expectIPs": ["geoip:cn"]
      },
      {
        "address": "8.8.8.8",
        "port": 53,
        "domains": [
          "geosite:geolocation-!cn",
          "geosite:speedtest",
          "ext:h2y.dat:gfw"
        ]
      },
      "1.1.1.1",
      "localhost"
    ]
  }
}
```

**clientIP**

> clientIP 是 DNS 请求中可以带上的一个参数，它用来提示 DNS 服务器（223.5.5.5）你所在的地理位置

能用routing解决就不要用clientIP解决

**DNS outbound**

dns outbound就是接收dns请求报文，回复dns报文

关键是如何让dns流量请求到outbound，可以用任意门监听53端口，然后设置dns服务器为这台机器

也可以设置透明代理或者全局代理，在routing部分将访问53的udp流量导向dns outbound

有个问题就是dns outbound使用了内置dns，但是dns请求还是可能发送到外部dns服务器

**fake dns**

如何让本地完全不发出dns解析，而是让远端的proxy发出dns请求：

一个方法是把dns的流量都发到proxy，让proxy去请求，需要设置dns流量服务器或者全局代理

第二种就是fake dns，制造一个伪造的dns回复，然后当收到这个伪造的ip请求时，用fake dns解析出真实域名请求，发送到远端proxy，这个方法需要全局代理

**强制tcp**

伪造一个设置了 truncated flag 的答复返回给客户端，客户端就会转用 TCP 来做 DNS 请求了

#### tun模式初步了解

tun设备可以直接被程序用路径读取ip包

#### sniffing

目的：主机的请求可能会被dns污染，导致解析的ip不对，嗅探可以直接拿到域名，用这个域名，可以解决dns污染

sni是传输层的，用于tls服务端判断使用什么证书回复，而http的host是应用层的

#### domainStrategy

domainStrategy在routing中表明用ip还是域名去匹配规则，而在freedom outbound中表明是否用本地dns还是自建dns模块
