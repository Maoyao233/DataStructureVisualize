import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const sortModule = {
  state: {
    values: [], // 值为 SORT_ARRAY 的副本
    cards: [], // 可视化需要的数组，就是每一个长方形（div元素），数组的每一个值都代表一个div元素
    done: true, // 表示是否排序完成，为true时，右下角出现重置按钮

    // strValues 用来解决数组中出现重复的值，移动位置不对的情况
    //strValues: [], // 数组的一个副本，会将数组的值与下标拼起来，形成唯一的一个字符串
  },

  mutations: {
    // 重置，重新开始排序
    reset(state, payload) {
      state.values = [];
      for (let i = 0; i < payload.values.length; i++) {
        state.values.push( {
          value: payload.values[i],
          cardIndex: i
        });
      }
      // 往 state.cards 中，添加对象，每个对象都代表一个需要排序的长方形（div元素）
      state.cards = [];
      for (let i = 0; i < state.values.length; i++) {
        state.cards.push({
          value: state.values[i].value, // 数组中的值
          //strValue: state.strValues[i], //数组中的值和下标拼接的字符串
          sortIndex: i, // 排序的索引
          isActive: false, // 是否激活
          isLocked: false  // 是否锁定
        });
      }

      state.done = false;
    },

    // 交换
    swap(state, payload) {
      let u = payload.indexes[0];
      let v = payload.indexes[1];

      let a = state.values[u].cardIndex;
      let b = state.values[v].cardIndex;

      state.cards[a].sortIndex = v;
      //state.cards[a].value=state.values[v].value;
      state.cards[b].sortIndex = u;
      //state.cards[b].value=state.values[u].value;

      let tmp = Object.assign({}, state.values[u]);
      Object.assign(state.values[u], state.values[v]);
      Object.assign(state.values[v], tmp);
    },

    //将indexes[0]向前插入到indexes[1]的位置
    insert_to_front(state, payload) {
      let u = payload.indexes[0];
      let v = payload.indexes[1];

      let tmp = Object.assign({}, state.values[u]);

      for (let i = u - 1; i >= v; i--) {
        state.cards[state.values[i].cardIndex].sortIndex = i + 1;
        Object.assign(state.values[i + 1], state.values[i]);
      }

      Object.assign(state.values[v], tmp);
      state.cards[tmp.cardIndex].sortIndex = v;
    },

    // 激活 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isActive设置为true
    activate(state, payload) {
      payload.indexes.forEach((index) => {
        /*
        state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = true;
        });*/
        let u = state.values[index].cardIndex;
        state.cards[u].isActive = true;
      });
    },

    //  释放 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isActive设置为false
    deactivate(state, payload) {
      payload.indexes.forEach((index) => {
        /*
        state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isActive = false;
        });*/
        let u = state.values[index].cardIndex;
        state.cards[u].isActive = false;
      });
    },

    // 锁定 
    // 用参数 payload的indexes属性中所有成员，与state.cards 的每个成员（card）的sortIndex属性与进行匹配，
    // 如果找到相等的，就将state.cards 的成员（card）的isLocked设置为true
    lock(state, payload) {
      payload.indexes.forEach((index) => {
        /*state.cards.forEach((card) => {
          if (card.sortIndex === index) card.isLocked = true;
        });*/
        let u = state.values[index].cardIndex;
        state.cards[u].isLocked = true;
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
