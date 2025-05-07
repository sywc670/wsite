<script setup>
import { NAV_DATA } from './data'
</script>

# 前端导航

<WNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>

