<template>
  <div class="records">
    <h1><span class="thin">Accuracy</span> <span class="thick">Records</span></h1>
    <table>
        <tr>
          <th class="algo-name">Algo</th>
          <th class="accuracy">Accuracy</th>
          <th class="dataset">Dataset</th>
          <th class="train-size">Train Size</th>
          <th>Config</th>
        </tr>
        <tr v-for="(record, index) in records" :key="index" class="">
          <td>{{ record.algo }}</td>
          <td>{{ record.accuracy.toFixed(3) }}%</td>
          <td>{{ record.dataset }}</td>
          <td>{{ record.train_ratio.toFixed(2) }}</td>
          <td>
            <span v-if="record.algo == 'KNN'">
              N-Neighbors: {{ record.config.n_neighbors }} &emsp;
              Weight: {{ record.config.weight }} &emsp;
              Power-Parameter: {{ record.config.power_parameter }}
            </span>
            <span v-else-if="record.algo == 'SVM'">
              sth
            </span>
            <span v-else-if="record.algo == 'MLP'">
              sth
            </span>
            <span v-else-if="record.algo == 'CNN'">
              sth
            </span>
          </td>
        </tr>
      </table>
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
  table {
    border-collapse: collapse;
  }
  tr {
    border-bottom: 1px solid #3C2E3D;
    line-height: 2.5;
    margin: 10px 0px;
  }
  th {
    text-align: left;
  }
  .algo-name {
    width:50px;
  }
  .accuracy {
    width: 100px;
  }
  .dataset {
    width: 200px;
  }
  .train-size {
    width: 100px;
  }
</style>

<script>
import Records from '@/services/Records'
export default {
  name: 'Records',
  data () {
    return {
      records: []
    }
  },
  mounted () {
    this.getRecords()
  },
  methods: {
    async getRecords () {
      const response = await Records.fetchRecords()
      this.records = response.data.records
      console.log(response)
    }
  }
}
</script>
