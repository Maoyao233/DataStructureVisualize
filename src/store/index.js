import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const sortModule = {
  state: {
    values: [], // 值为 SORT_ARRAY 的副本
    cards: [], // 可视化需要的数组，就是每一个长方形（div元素），数组的每一个值都代表一个div元素
    done: true, // 表示是否排序完成，为true时，右下角出现重置按钮

    // strValues 用来解决数组中出现重复的值，移动位置不对的情况
    strValues: [], // 数组的一个副本，会将数组的值与下标拼起来，形成唯一的一个字符串
  },

  mutations: {
    // 重置，重新开始排序
    reset(state, payload) {
      state.values = payload.values;
      // 遍历state.values，把state.values的每个值和下标拼接，形成唯一的字符串
      // 值 和 下标 中间加上一个 符号，确保是唯一的，注意符号不能用""空字符串
      state.values.forEach((item, i) => state.strValues.push(item + '&' + i));

      // 往 state.cards 中，添加对象，每个对象都代表一个需要排序的长方形（div元素）
      state.cards = [];
      for (let i = 0; i < state.values.length; i++) {
        state.cards.push({
          value: state.values[i], // 数组中的值
          strValue: state.strValues[i], //数组中的值和下标拼接的字符串
          sortIndex: i, // 排序的索引
          isActive: false, // 是否激活
          isLocked: false  // 是否锁定
        });
      }

      state.done = false;
    },

    // 交换
    swap(state, payload) {
      let a = payload.indexes[0];
      let b = payload.indexes[1];
      let temp = state.values[a];

      // 交换真实的值
      state.values[a] = state.values[b];
      state.values[b] = temp;

      // 交换 数组中的值和下标拼接的字符串
      let temp2 = state.strValues[a];
      state.strValues[a] = state.strValues[b];
      state.strValues[b] = temp2;

      // 重新定义state.cards的每个成员的sortIndex属性
      state.cards.forEach((card) => {
        card.sortIndex = state.strValues.indexOf(card.strValue);
      });
    },

    // 激活 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isActive设置为true
    activate(state, payload) {
      payload.indexes.forEach((index) => {
        state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = true;
        });
      });
    },

    //  释放 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isActive设置为false
    deactivate(state, payload) {
      payload.indexes.forEach((index) => {
        state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = false;
        });
      });
    },

    // 锁定 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isLocked设置为true
    lock(state, payload) {
      payload.indexes.forEach((index) => {
        state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isLocked = true;
        });
      });
    },

    // 完成
    done(state) {
      state.done = true;
    }
  }
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    sort: sortModule
  }
})
