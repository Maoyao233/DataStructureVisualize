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
      <button aria-label="Reset" v-if="store.state.sort.done" @click="reset(sort_array)">
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script>
import sortCard from "../components/SortCard.vue";
import store from "../store";

const SORT_ARRAY = [16, 11, 4, 5, 5, 7, 9, 2, 14, 10];
const EVENT_DELAY = 200;

export default {
  name: "Sort",
  store,
  created() {
    this.reset(SORT_ARRAY);
  },
  components: {
    sortCard,
  },
  methods: {
    // 重置
    reset(arr) {
      // 获取传入数组的一个副本，因为重置功能需要不改变原数组
      let values = arr.slice();
      store.commit({ type: "reset", values: values });

      // 排序数组，返回一个包括每步的值 和 每步状态的数组
      let sequence = this.sort(values);

      // 遍历上边排序得到的数组，定时执行操作，实现动画效果
      sequence.forEach((event, index) => {
        setTimeout(() => {
          store.commit(event);
        }, index * EVENT_DELAY);
      });
    },

    // 冒泡排序方法，返回包括每一步的数组
    bubbleSort(values) {
      // sequence 为包括每一步内容的数组
      let sequence = [];
      // swapped 为判断是否已经排序好的 标志位
      let swapped;
      // indexLastUnsorted 用来减少不必要的循环
      let indexLastUnsorted = values.length - 1;

      do {
        swapped = false;
        for (let i = 0; i < indexLastUnsorted; i++) {
          sequence.push({ type: "activate", indexes: [i, i + 1] });

          if (values[i] > values[i + 1]) {
            let temp = values[i];
            values[i] = values[i + 1];
            values[i + 1] = temp;
            swapped = true;
            sequence.push({ type: "swap", indexes: [i, i + 1] });
          }

          sequence.push({ type: "deactivate", indexes: [i, i + 1] });
        }

        sequence.push({ type: "lock", indexes: [indexLastUnsorted] });
        indexLastUnsorted--;
      } while (swapped);

      // 如果提前排序好了，把剩下的card全部锁定
      let skipped = Array.from(Array(indexLastUnsorted + 1).keys());
      sequence.push({ type: "lock", indexes: skipped });
      // 修改done 为true，完成排序
      sequence.push({ type: "done" });
      console.log("包括每一步内容的数组", sequence);
      return sequence;
    },

    //简单插入排序
    insertionSort(values) {
      let sequence = [];
      sequence.push({ type: "lock", indexes: [0] });
      for (let i = 1; i < values.length; i++) {
        let p = i;
        let j;
        for (j = i - 1; j >= 0; j--) {
          sequence.push({ type: "activate", indexes: [j, i] });
          sequence.push({ type: "deactivate", indexes: [j, i] });
          if (values[j] > values[i]) {
            p = j;
          } else {
            break;
          }
        }
        if (p < i) {
          sequence.push({ type: "insert_to_front", indexes: [i, p] });
          let t = values[i];
          for (let j = i - 1; j >= p; j--) {
            values[j + 1] = values[j];
          }
          values[p] = t;
        }
        sequence.push({ type: "lock", indexes: [p] });
      }
      sequence.push({ type: "done" });
      return sequence;
    },

    //二分插入排序
    binaryInsertionSort(values) {
      let sequence = [];
      sequence.push({ type: "lock", indexes: [0] });
      for (let i = 1; i < values.length; i++) {
        let l = 0,
          r = i;
        while (l < r) {
          let mid = parseInt((l + r) / 2);
          sequence.push({ type: "activate", indexes: [mid, i] });
          sequence.push({ type: "deactivate", indexes: [mid, i] });
          if (values[mid] < values[i]) {
            l = mid + 1;
          } else {
            r = mid;
          }
        }
        if (l < i) {
          sequence.push({ type: "insert_to_front", indexes: [i, l] });
          let t = values[i];
          for (let j = i - 1; j >= l; j--) {
            values[j + 1] = values[j];
          }
          values[l] = t;
        }
        sequence.push({ type: "lock", indexes: [l] });
      }
      sequence.push({ type: "done" });
      return sequence;
    },

    //希尔排序
    shellSort(values) {
      let sequence = [];
      let len = values.length;
      //获取增量序列
      let gap = 1;
      while (gap < len / 3) {
        gap = gap * 3 + 1;
      }
      //分组插入排序
      while (gap > 1) {
        for (let i = 0; i < len; i++) {
          for (let j = i; j >= gap; j -= gap) {
            sequence.push({ type: "activate", indexes: [j, j - gap] });
            sequence.push({ type: "deactivate", indexes: [j, j - gap] });
            if (values[j] < values[j - gap]) {
              sequence.push({ type: "swap", indexes: [j, j - gap] });
              let temp = values[j - gap];
              values[j - gap] = values[j];
              values[j] = temp;
            } else {
              break;
            }
          }
        }
        gap = (gap - 1) / 3;
      }
      //最后一趟，gap=1时等价于对整个数组插入排序，因此直接复用二分插入排序的代码
      sequence = sequence.concat(this.binaryInsertionSort(values));
      return sequence;
    },

    selectionSort(values) {
      let sequence = [];
      for (let i = 0; i < values.length - 1; i++) {
        let minPos = i;
        for (let j = i + 1; j < values.length; j++) {
          sequence.push({ type: "activate", indexes: [minPos, j] });
          if (values[j] < values[minPos]) {
            sequence.push({ type: "deactivate", indexes: [minPos] });
            minPos = j;
          } else {
            sequence.push({ type: "deactivate", indexes: [j] });
          }
        }
        sequence.push({ type: "deactivate", indexes: [minPos] });
        if (minPos != i) {
          sequence.push({ type: "swap", indexes: [i, minPos] });
          let tmp = values[i];
          values[i] = values[minPos];
          values[minPos] = tmp;
        }
        sequence.push({ type: "lock", indexes: [i] });
      }
      sequence.push({ type: "lock", indexes: [values.length - 1] });
      sequence.push({ type: "done" });
      return sequence;
    },

    quickSort(values) {
      let sequence = [];
      quickSortRecursive(0, values.length);
      console.log(values);
      sequence.push({ type: "done" });
      return sequence;

      function quickSortRecursive(begin, end) {
        if (end - begin <= 1) {
          if (begin < values.length) {
            sequence.push({ type: "lock", indexes: [begin] });
          }
          return;
        }
        let pivot = values[begin];
        let i = begin;
        let j = end - 1;
        while (i < j) {
          while (i < j) {
            sequence.push({ type: "activate", indexes: [begin, j] });
            sequence.push({ type: "deactivate", indexes: [begin, j] });
            if (values[j] >= pivot) {
              j--;
            } else {
              break;
            }
          }
          while (i < j) {
            sequence.push({ type: "activate", indexes: [begin, i] });
            sequence.push({ type: "deactivate", indexes: [begin, i] });
            if (values[i] <= pivot) {
              i++;
            } else {
              break;
            }
          }
          if (i < j) {
            sequence.push({ type: "swap", indexes: [i, j] });
            let t = values[i];
            values[i] = values[j];
            values[j] = t;
          }
        }
        sequence.push({ type: "swap", indexes: [begin, i] });
        values[begin] = values[i];
        values[i] = pivot;
        sequence.push({ type: "lock", indexes: [i] });
        quickSortRecursive(begin, i);
        quickSortRecursive(i + 1, end);
      }
    },
  },
  data: function () {
    return {
      store: store,
      sort_array: SORT_ARRAY,
      sort: this.quickSort,
    };
  },
};
</script>

<style lang="scss" scoped>
$transition-time: 200ms;
$easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);

@import url("https://fonts.googleapis.com/css?family=Titillium+Web:700");
@import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

*,
*::before,
*::after {
  box-sizing: border-box;
}

.sort {
  width: 640px;
  position: relative;
  margin: 0 auto;
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

h1 {
  margin: 0;
  font-size: 2.5rem;
}

button {
  appearance: none;
  background: none;
  border: none;
  color: #42b983;
  font-size: 1.5rem;
  cursor: pointer;
}

@media only screen and (min-width: 880px) {
  #sort {
    width: 800px;
  }
  .value {
    font-size: 1.5rem;
  }
}

@media only screen and (min-width: 1084px) {
  #sort {
    width: 1024px;
  }
  .value {
    font-size: 1.75rem;
  }
}
</style>