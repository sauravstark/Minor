<template>
  <div>
    <div>
      <h1><span class="thin">KNN</span> <span class="thick">Algorithm</span></h1>
    </div>
    <div class="container">
      <canvas resize id="main-canvas"></canvas>
      <div class="form-container">
        <div class="form-element">
          <h3>Dataset:</h3>
          <select v-model="dataset">
            <option value="MNIST - Digits">MNIST - Digits</option>
            <option value="ETLCDB">ETLCDB</option>
          </select>
          <p>10 classes and {{ Number(70000).toLocaleString() }} records</p>
          <p id="dataset-info">Modified National Institute of Standards and Technology database (MNIST) is a large database of handwritten digits. The images are noramlized to 28x28 pixel bounding box where each pixel is has a grayscale level between 0 and 255.</p>
        </div>
        <div class="form-element">
          <h3>N Neighbors:</h3>
          <select v-model="neighbor">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
          </select>
        </div>
        <div class="form-element">
          <h3>Power Parameter:</h3>
          <select v-model="power">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div class="form-element">
          <h3>Weight Function:</h3>
          <select v-model="weight">
            <option value="uniform">Uniform</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style type="text/css">
  h1 {
    background-color: #DAE9E4;
    padding: 5px 10px;
  }
  .thick {
    font-family: Roboto;
    font-weight: 700
  }
  .thin {
    font-family: Roboto;
    font-weight: 100
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
  .form-container {
    width: 400px;
  }
  .form-element {
    width: 100%;
    border-bottom: 1px solid #3C2E3D;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
  .form-element select {
    border-radius: 15px;
    font-family: Poppins, Helvetica, Arial, sans-serif;
    height: 30px;
    margin: 0px 0px 10px;
    padding: 0px 15px;
  }
  .form-container select:hover {
    cursor: pointer;
  }
  #dataset-info {
    text-align: justify;
  }
  #main-canvas {
    border: 1px solid #3C2E3D;
    width: 1400px;
    height: 700px;
  }
</style>

<script>
import Algorithm from '@/services/Algorithm'
import paper from 'paper'

function dist (pt1, pt2, power) {
  var d = Math.pow(Math.pow(Math.abs(pt2.x - pt1.x), power) + Math.pow(Math.abs(pt2.y - pt1.y), power), 1 / power)
  return d
}

export default {
  name: 'Algorithm',
  data () {
    return {
      // model params
      neighbor: 3,
      power: 2,
      weight: 'uniform',
      dataset: 'MNIST - Digits',

      // paperjs values
      rad1: 20,
      rad2max: 20,
      rad2min: 10,
      margin: 5
    }
  },
  mounted () {
    this.updateDrawing()
  },
  updated () {
    this.updateDrawing()
  },
  computed: {
    height () {
      return document.getElementById('main-canvas').offsetHeight
    },
    width () {
      return document.getElementById('main-canvas').offsetWidth
    },
    dataPoints () {
      var arr = []
      var n = 0
      while (n < 30) {
        var point = { x: Math.random() * this.width, y: Math.random() * this.height }
        var push = true
        if ((Math.abs(point.x - this.width / 2) < this.rad1 + this.rad2max + this.margin) || (Math.abs(point.y - this.height / 2) < this.rad1 + this.rad2max + this.margin)) {
          push = false
        } else {
          arr.forEach(element => {
            if (dist(element, point, 2) < this.rad2max * 2 + this.margin) {
              push = false
            }
          })
        }
        if (push) {
          arr.push(point)
          ++n
        }
      }
      var centre = { x: this.width / 2, y: this.height / 2 }
      return arr.sort((a, b) => { return dist(a, centre, 2) - dist(b, centre, 2) })
    },
    rad3 () {
      var pt1 = {x: this.width / 2, y: this.height / 2}
      var pt2 = this.dataPoints[this.neighbor - 1]
      var d = dist(pt1, pt2, this.power) + this.rad2max + this.margin / 2
      return d
    }
  },
  methods: {
    updateDrawing () {
      paper.setup(document.getElementById('main-canvas'))
      var redScore = 0
      var bluScore = 0
      const centre = new paper.Point(this.width / 2, this.height / 2)
      for (var i = 0; i < 30; ++i) {
        var rad = (i < this.neighbor) ? (this.weight === 'distance') ? this.rad2min + (this.rad2max - this.rad2min) * (this.neighbor - i) / (this.neighbor) : this.rad2max : this.rad2min
        var dataPoint = new paper.Path.Circle(this.dataPoints[i], rad)
        if (dataPoint.position.x + (this.height - this.width) / 2 < dataPoint.position.y) {
          dataPoint.fillColor = 'red'
          if (i >= this.neighbor) {
            dataPoint.fillColor.alpha = 0.5
          } else {
            redScore += (this.weight === 'distance') ? (1 / dist(dataPoint.position, centre, this.power)) : 1
          }
        } else {
          dataPoint.fillColor = 'blue'
          if (i >= this.neighbor) {
            dataPoint.fillColor.alpha = 0.5
          } else {
            bluScore += (this.weight === 'distance') ? (1 / dist(dataPoint.position, centre, this.power)) : 1
          }
        }
      }
      const range = new paper.Path()
      range.strokeColor = 'black'
      for (i = 0; i < 4; ++i) {
        for (var j = 0; j < 50; ++j) {
          var ang = i * Math.PI / 2 + (j / 50) * Math.PI / 2
          var r = this.rad3 / Math.pow(Math.pow(Math.abs(Math.cos(ang)), this.power) + Math.pow(Math.abs(Math.sin(ang)), this.power), 1 / this.power)
          var newPoint = new paper.Point(this.width / 2 + r * Math.cos(ang), this.height / 2 + r * Math.sin(ang))
          range.add(newPoint)
        }
      }
      range.closed = true
      range.smooth()
      const square = new paper.Path.Rectangle(this.width / 2 - this.rad1, this.height / 2 - this.rad1, this.rad1 * 2, this.rad1 * 2)
      square.fillColor = redScore > bluScore ? 'red' : 'blue'
    }
  }
}
</script>
