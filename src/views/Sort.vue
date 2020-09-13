<template>
  <el-container>
    <el-aside>
      <h4>请选择排序方式：</h4>
      <el-select v-model="sortFunc">
        <el-option
          v-for="(item,index) in func_options"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br />
      <el-button type="primary" round v-on:click="randomizeSortArray()">随机数据</el-button>
      <el-popover placement="right" trigger="click">
        <el-slider
          v-on:change="$message({type:'success',message:'修改成功，重置动画后生效'})"
          v-model="eventDelay"
          :format-tooltip="formatToolTip"
          :max="1000"
          :min="100"
        ></el-slider>
        <el-button slot="reference" type="primary" round>动画速度</el-button>
      </el-popover>
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </el-aside>
    <el-main>
      <sort-visualizer
        v-on:percentagechange="getPercentage"
        :sort-array="sortArray"
        :sort-func="sortFunc"
        :event-delay="eventDelay"
      ></sort-visualizer>
    </el-main>
  </el-container>
</template>

<script>
import sortVisualizer from "../components/SortVisualizer.vue";
import store from "../store";
import {
  binaryInsertionSort,
  bubbleSort,
  insertionSort,
  quickSort,
  selectionSort,
  shellSort,
} from "../components/SortAlgorithms.js";

export default {
  name: "Sort",
  store,
  components: {
    sortVisualizer,
  },
  created() {
    this.randomizeSortArray();
  },
  methods: {
    randomizeSortArray() {
      this.sortArray = [];
      let cnt = parseInt(Math.random() * 5 + 10);
      for (let i = 0; i < cnt; i++) {
        this.sortArray.push(parseInt(Math.random() * 18) + 2);
      }
    },
    getPercentage: function (percentage) {
      this.percentage = percentage;
    },
    formatToolTip: function (val) {
      return "每步时长：" + val + "ms";
    },
  },
  data: function () {
    return {
      func_options: [
        {
          value: insertionSort,
          label: "直接插入排序",
        },
        {
          value: binaryInsertionSort,
          label: "折半插入排序",
        },
        {
          value: shellSort,
          label: "希尔排序",
        },
        {
          value: bubbleSort,
          label: "冒泡排序",
        },
        {
          value: quickSort,
          label: "快速排序",
        },
        {
          value: selectionSort,
          label: "简单选择排序",
        },
      ],
      sortFunc: bubbleSort,
      sortArray: [],
      percentage: 0,
      eventDelay: 200,
    };
  },
};
</script>

<style scoped>
.el-select {
  display: block;
  width: fit-content;
  margin: auto;
}

.el-button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  margin-bottom: 10%;
}
</style>