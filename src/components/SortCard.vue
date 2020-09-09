<template>
  <div
    class="card-wrapper"
    :data-sort-index="sortIndex"
    v-bind:style="{height: value * 15 + 'px',transform: 'translateX('+sortIndex*100+'%)'}"
  >
    <!-- 通过改变class，来改变颜色 -->
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
        "card-locked": this.isLocked,
      };
    },
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

.card-wrapper {
  position: absolute;
  bottom: 0;
  width: 6.25%;
  transition: transform $transition-time $easing;
}

.card {
  position: relative;
  height: 100%;
  margin: 0 5px;
  background-color: #42b983;
  box-shadow: 0 0 25px #78cf9571;
}

.card-active {
  filter: hue-rotate(180deg);
}

.card-locked {
  filter: hue-rotate(90deg);
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
