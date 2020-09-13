<template>
  <div
    class="card-wrapper"
    :data-sort-index="sortIndex"
    v-bind:style="{height: value * 15 + 'px',transform: 'translateX('+(sortIndex+1)*100+'%)'}"
  >
    <div class="card" :class="cardClassObject">
      <div class="value">{{value}}</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "sortCard",
  props: {
    value: Number,
    sortIndex: Number,
    isActive: Boolean,
    isLocked: Boolean,
  },
  computed: {
    cardClassObject() {
      return {
        "card-active": this.isActive,
        "card-locked": this.isLocked && !this.isActive,
      };
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

.card-wrapper {
  position: absolute;
  bottom: 0;
  width: 6.25%;
  transition: all $transition-time $easing;
}

.card {
  position: relative;
  height: 100%;
  margin: 0 5px;
  background-color: #839af6;
  box-shadow: 0 0 25px #1405e21b;
}

.card-active {
  background-color: #fdff75;
}

.card-locked {
  color:aliceblue;
  background-color:royalblue;
}

.value {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 1.25rem;
}


</style>
