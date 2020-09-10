<template>
  <el-container>
    <el-main>
      <sort-visualizer :sort-array="sortArray" :sort-func="sortFunc"></sort-visualizer>
    </el-main>
    <el-aside>
      <el-select v-model="sortFunc">
        <el-option
          v-for="(item,index) in func_options"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button type="primary" round @click="randomizeSortArray()">随机数据</el-button>
    </el-aside>
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
    };
  },
};
</script>

<style scoped>
</style>