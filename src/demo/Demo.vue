<template>
  <div style="margin-top: 50px; margin-bottom: 50px">
    <h1>Vnodes</h1>

    <h2>Sink</h2>
    <sink>
    </sink>

    <h2>Edit</h2>
    <edit>
    </edit>

    <h2>Ports</h2>
    <ports>
    </ports>

    <h2>Labels</h2>
    <labels>
    </labels>

    <h2>Benchpress</h2>
    <benchpress>
    </benchpress>
  </div>
</template>

<script>
import Sink from './Sink'
import Edit from './Edit'
import Ports from './Ports'
import Labels from './Labels'
import Benchpress from './Benchmark'
export default {
  components: {
    Sink,
    Edit,
    Ports,
    Labels,
    Benchpress
  },
}
</script>

<style>
h2 {
  font-size: 1.5em;
}
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
  /* .demo {
    flex-flow: column wrap;
  }
  .viewport {
    width: 100%;
  }
  .sidebar {
    max-width: 100%;
    width: 100%;
    padding: 0;
    margin-top: 20px;
  } */
}
</style>
