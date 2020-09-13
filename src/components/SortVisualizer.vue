<template>
  <div class="sort">
    <div class="cards">
      <sortCard
        v-for="(card, index) in store.state.sort.cards"
        :key="index"
        :value="card.value"
        :sort-index="card.sortIndex"
        :is-active="card.isActive"
        :is-locked="card.isLocked"
      ></sortCard>
    </div>
    <div class="control-panel">
      <h1>Sort Visualizer</h1>
      <div style="display:none"> {{ percentage }} </div>
      <el-button-group>
        <el-tooltip content="暂停/继续">
        <el-button v-if="paused" id="play_button" icon="el-icon-video-play" round @click="play()"></el-button>
        <el-button v-else id="pause_button" icon="el-icon-video-pause" round @click="pause()"></el-button>
        </el-tooltip>
        <el-tooltip content="重置">
        <el-button id="reset_button" icon="el-icon-refresh" round @click="reset()"></el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import sortCard from "./SortCard.vue";
import store from "../store";

export default {
  name: "SortVisualizer",
  mounted() {
    this.reset();
  },
  components: {
    sortCard,
  },
  computed: {
    sequence: function () {
      return this.sortFunc(this.sortArray.slice());
    },
    percentage: function () {
      let percentage = parseInt((this.curStep / this.sequence.length) * 100);
      if (isNaN(percentage)) {
        percentage = 0;
      }
      this.$emit("percentagechange", percentage);
      return percentage;
    },
  },
  watch: {
    sequence: function () {
      this.$message({
        message: "设置成功",
        type: "success",
      });
      this.reset();
    },
  },
  methods: {
    // 重置
    reset() {
      document.getElementById("reset_button").blur();
      if (this.intervalHandle !== null) {
        clearInterval(this.intervalHandle);
      }
      this.curStep = 0;
      this.paused = true;
      store.commit({ type: "setSortArray", values: this.sortArray });
      this.intervalHandle = setInterval(this.step, this.eventDelay);
    },
    pause() {
      document.getElementById("pause_button").blur();
      //演示已经完成
      if (this.curStep == this.sequence.length || this.paused) {
        return;
      }
      this.$message({
        message: "暂停演示",
        type: "info",
      });
      this.paused = true;
    },
    play() {
      document.getElementById("play_button").blur();
      //演示已经完成
      if (this.curStep == this.sequence.length || !this.paused) {
        return;
      }
      //开始演示
      if (this.curStep == 0) {
        this.$message({
          message: "开始演示",
          type: "success",
        });
      } else {
        this.$message({
          message: "继续",
          type: "info",
        });
      }
      this.paused = false;
    },
    step() {
      if (this.paused) {
        return;
      }
      if (this.curStep < this.sequence.length) {
        store.commit(this.sequence[this.curStep]);
        this.curStep++;
      }
      if (this.curStep == this.sequence.length) {
        if (this.intervalHandle !== null) {
          clearInterval(this.intervalHandle);
          this.intervalHandle = null;
        }
        this.$message({
          message: "排序完成！",
          type: "success",
        });
      }
    },
  },
  data: function () {
    return {
      store: store,
      intervalHandle: null,
      paused: false,
      curStep: 0,
    };
  },
  props: {
    sortArray: Array,
    sortFunc: Function,
    eventDelay: {
      type: Number,
      default: 200,
    },
  },
};
</script>

<style lang="scss" scoped>
$transition-time: 200ms;
$easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);

*,
*::before,
*::after {
  box-sizing: border-box;
}

.sort {
  position: relative;
  margin: 40px auto;
}

.cards {
  position: relative;
  height: 300px;
}

.control-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 5px 0;
  padding-top: 20px;
  border-top: 2px solid #2c3e50;
}

.el-button-group {
  margin-right: 10%;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
}

button {
  appearance: none;
  background: none;
  border-color: #42b983;
  color: #42b983;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>