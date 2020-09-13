<template>
  <el-container>
    <el-aside>
      <el-button type="primary" round v-on:click="setPlayerNumber()">设置人数</el-button>
      <el-button type="primary" round v-on:click="setStartPos()">起始位置</el-button>

      <el-popover placement="right" trigger="click">
        <el-slider
          v-on:change="$message({type:'success',message:'修改成功，重置动画后生效'})"
          v-model="eventDelay"
          :format-tooltip="formatToolTip"
          :max="1000"
          :min="400"
        ></el-slider>
        <el-button slot="reference" type="primary" round v-on:click="setEventDelay()">动画速度</el-button>
      </el-popover>
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </el-aside>
    <el-main>
      <josephus-visualizer
        v-on:percentagechange="getPercentage"
        :peopleNum="peopleNum"
        :start="start"
        :eventDelay="eventDelay"
      ></josephus-visualizer>
    </el-main>
  </el-container>
</template>

<script>
import JosephusVisualizer from "../components/JosephusVisualizer.vue";
import simulateJosephus from "../components/JosephusSimulator.js";

export default {
  name: "Josephus",
  components: {
    JosephusVisualizer,
  },
  created() {
    console.log("xxx");
    simulateJosephus(
      this.peopleNum,
      (this.start - 1 + this.peopleNum) % this.peopleNum
    );
  },
  methods: {
    getPercentage: function (percentage) {
      this.percentage = percentage;
    },
    formatToolTip: function (val) {
      return "每步时长：" + val + "ms";
    },
    setPlayerNumber: function () {
      this.$prompt("请输入游戏人数(3-12)", "设置人数", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "number",
        inputValidator: (v) => {
          return v >= 3 && v <= 12;
        },
        inputErrorMessage: "为达到最佳显示效果，游戏人数应当在3-12之间！",
      }).then(( n ) => {
        console.log(n);
        this.peopleNum = parseInt(n.value);
      });
    },
    setStartPos: function () {
      this.$prompt("请输入第一个扔骰子的人", "起始位置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "number",
        inputValidator: (v) => {
          if (v < 1) {
            return "起始位置必须是正整数！";
          }
          if (v > this.peopleNum) {
            return "起始位置不能超过游戏人数！";
          }
          return true;
        },
      }).then(( n ) => {
        console.log(n);
        this.start = parseInt(n.value) - 1;
        console.log(this.start);
      });
    },
  },
  data: function () {
    return {
      peopleNum: 12,
      start: 0,
      percentage: 0,
      eventDelay: 500,
    };
  },
};
</script>

<style scoped>
.el-button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  margin-bottom: 10%;
}
</style>