import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const sortModule = {
  state: {
    sortArray: [],

    //排序过程中的数组
    values: [],
    cards: [],
  },

  mutations: {
    setSortArray(state, payload) {
      state.sortArray = payload.values.slice();
      this.commit({ type: "reset" });
    },
    // 重置
    reset(state) {
      state.values = [];
      for (let i = 0; i < state.sortArray.length; i++) {
        state.values.push({
          value: state.sortArray[i],
          cardIndex: i
        });
      }
      // 往 state.cards 中，添加对象，每个对象都代表一个需要排序的长方形（div元素）
      state.cards = [];
      for (let i = 0; i < state.sortArray.length; i++) {
        state.cards.push({
          value: state.sortArray[i], // 数组中的值
          sortIndex: i, // 排序的索引
          isActive: false, // 是否激活
          isLocked: false  // 是否锁定
        });
      }
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
    activate(state, payload) {
      payload.indexes.forEach((index) => {
        let u = state.values[index].cardIndex;
        state.cards[u].isActive = true;
      });
    },

    //  释放 
    deactivate(state, payload) {
      payload.indexes.forEach((index) => {
        let u = state.values[index].cardIndex;
        state.cards[u].isActive = false;
      });
    },

    // 锁定 
    lock(state, payload) {
      payload.indexes.forEach((index) => {
        let u = state.values[index].cardIndex;
        state.cards[u].isLocked = true;
      });
    }
  }
}

const JosephusModule = {
  namespaced: true,
  state: {
    players: [],
    deadOrder: []
  },
  mutations: {
    setPlayers(state, payload) {
      state.players = new Array(payload.n);
      for (let i = 0; i < payload.n; i++) {
        state.players[i] = {
          number: i + 1,
          isKilled: false,
          isActive: false,
          isDanger: false
        }
      }
      state.deadOrder = [];
    },
    // 重置
    reset(state) {
      for (let i = 0; i < state.players.length; i++) {
        state.players[i] = {
          number: i + 1,
          isKilled: false,
          isActive: false,
          isDanger: false
        }
      }
      state.deadOrder = [];
    },

    // 激活 
    activate(state, payload) {
      payload.indexes.forEach((index) => {
        state.players[index].isActive = true;
      });
    },

    //  释放 
    deactivate(state, payload) {
      payload.indexes.forEach((index) => {
        state.players[index].isActive = false;
      });
    },

    // 准备移出游戏
    danger(state, payload) {
      payload.indexes.forEach((index) => {
        state.players[index].isDanger = true;
      });
    },

    // 移出游戏
    kill(state, payload) {
      payload.indexes.forEach((index) => {

        if (!state.players[index].isKilled) {
          state.deadOrder.push(index + 1);
        }
        state.players[index].isKilled = true;
      });
    }
  }
}

export default new Vuex.Store({
  modules: {
    sort: sortModule,
    Josephus: JosephusModule
  }
})
