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
      <h1>Bubble Sort Visualizer</h1>
      <button aria-label="Reset" v-if="store.state.sort.done" @click="reset(sort_array)">
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script>
import sortCard from "../components/SortCard.vue";
import store from "../store";

const SORT_ARRAY = [16, 11, 4, 5, 5, 7];
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
      let sequence = this.bubbleSort(values);

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
          // card 是 state.cards 的一个成员
          // 开始一次循环，就有两个card 的 isActive的值设置为true
          sequence.push({ type: "activate", indexes: [i, i + 1] });

          // 如果前一个数 大于 后一个数，就交换两数
          if (values[i] > values[i + 1]) {
            let temp = values[i];
            values[i] = values[i + 1];
            values[i + 1] = temp;
            swapped = true;
            // 满足交换的条件，就重新定义所有card的sortIndex属性
            sequence.push({ type: "swap", indexes: [i, i + 1] });
          }
          // 结束这次循环之前，把原来两个card的isActive的值为true的，设置为false
          sequence.push({ type: "deactivate", indexes: [i, i + 1] });
        }
        // 外层循环，每循环完一次，就锁定最后一个card，下次这个card 就不参与循环
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
  },
  data: function () {
    return {
      store: store,
      sort_array: SORT_ARRAY
    };
  },
};
</script>

<style lang="scss" scoped>
$transition-time: 200ms;
$easing: cubic-bezier(0.175, 0.885, 0.320, 1.275);

@import url('https://fonts.googleapis.com/css?family=Titillium+Web:700');
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

*, *::before, *::after {
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
  #sort { width: 800px; }
  .value { font-size: 1.5rem; }
}

@media only screen and (min-width: 1084px) {
  #sort { width: 1024px; }
  .value { font-size: 1.75rem; }
}

</style>