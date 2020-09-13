<template>
  <div class="josephus">
    <div class="players-disp">
      <div id="num"></div>
      <div
        class="player"
        v-for="(player,index) in getAlivePlayers()"
        :key="player.number"
        v-bind:style="{transform:'translateX(300px) rotate('+ index / getAlivePlayers().length * 360 + 'deg)', backgroundColor:player.color}"
      >
        <!-- 数字要转正 -->
        <div
          v-bind:style="{transform:'rotate('+ -index / getAlivePlayers().length * 360 + 'deg)'}"
        >{{player.number}}</div>
      </div>
    </div>
    <div class="control-panel">
      <h1>Josephus Problem</h1>
      <!-- 只有在模版中出现的变量才会被实时更新，但不希望它可见 -->
      <div style="display:none">{{ percentage }}</div>
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
import store from "../store";
import simulateJosephus from "./JosephusSimulator";

export default {
  name: "JosephusVisualizer",
  store,
  mounted() {
    this.reset();
  },
  computed: {
    sequence: function () {
      return simulateJosephus(this.peopleNum, this.start);
    },
    percentage: function () {
      let percentage = parseInt((this.curStep / this.sequence.length) * 100);
      if (isNaN(percentage) || !isFinite(percentage)) {
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
    getAlivePlayers() {
      let res = [];
      const activeColor = "#fdff75";
      const dangerColor = "tomato";
      const normalColor = "#839af6";
      this.store.state.Josephus.players.forEach((player) => {
        if (!player.isKilled) {
          res.push({
            number: player.number,
            color: player.isDanger
              ? dangerColor
              : player.isActive
              ? activeColor
              : normalColor,
          });
        }
      });
      return res;
    },
    reset() {
      document.getElementById("reset_button").blur();
      if (this.intervalHandle !== null) {
        clearInterval(this.intervalHandle);
      }
      this.curStep = 0;
      this.paused = true;
      store.commit({ type: "Josephus/setPlayers", n: this.peopleNum });
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
          message: "开始演示!   初始骰子：" + this.sequence[this.curStep].number,
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
        if (this.sequence[this.curStep].type === "Josephus/random") {
          if (this.curStep !== 0) {
            this.$message({
              type: "info",
              message: "当前骰子：" + this.sequence[this.curStep].number,
            });
          }
        } else {
          store.commit(this.sequence[this.curStep]);
        }
        this.curStep++;
      }
      if (this.curStep == this.sequence.length) {
        if (this.intervalHandle !== null) {
          clearInterval(this.intervalHandle);
          this.intervalHandle = null;
        }
        this.paused = true;
        this.gameFinish();
      }
    },
    gameFinish() {
      let msg="出局顺序：";
      this.store.state.Josephus.deadOrder.forEach(element => {
        msg+=element+' ';
      });
      this.$alert(msg,'游戏结束！')
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
    peopleNum: Number,
    start: Number,
    eventDelay: {
      type: Number,
      default: 500,
    },
  },
};
</script>

<style lang="scss" scoped>
$transition-time: 500ms;
$easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);

*,
*::before,
*::after {
  box-sizing: border-box;
}

.josephus {
  position: relative;
  margin: 40px auto;
}

.players-disp {
  position: relative;
  height: 300px;
}

.player {
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  border-radius: 50%;
  transform-origin: 50% 150px;
  transition: all $transition-time $easing;
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
<style lang="sass" scoped>
.num
  width: 20px
  height: 20px
  position: relative
  display: inline-block
  overflow: hidden
span
  display: inline-block
  line-height: 20px
  text-align: center
  overflow: hidden
  i
    width: 20px
    height: 20px
    display: block
    text-align: center
    font-style: normal
</style>