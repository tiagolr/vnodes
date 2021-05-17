<template>
  <div style="margin-top: 50px; margin-bottom: 50px">
    <h2>Groups and Ports</h2>
    <ports>
    </ports>

    <h2>Vnodes</h2>
    <sink>
    </sink>

    <h2>Edit</h2>
    <edit>
    </edit>

  </div>
</template>

<script>
import Sink from './Sink'
import Edit from './Edit'
import Ports from './Ports'

export default {
  components: {
    Sink,
    Edit,
    Ports
  },
}
</script>

<style>
body {
  background-color: #f9f9f9;
  max-width: 56em;
}
.demo {
  display: flex;
}
.viewport {
  height: 500px;
  flex-grow: 1;
}
.sidebar {
  padding-left: 20px;
  width: 200px;
  max-width: 200px;
  flex-shrink: 0;
}
@media only screen and (max-width: 1000px) {
  .viewport {
    flex-flow: column wrap;
  }
  .sidebar {
    max-width: 100%;
    width: 100%;
  }
}
</style>
