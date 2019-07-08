import axios from 'axios';
import _ from 'lodash';

const page_size = 100;

export default class ResultData {
  constructor(callback, job, get_url, accessToken) {
    this._dataList = [];
    this._end = page_size;
    this._pending = false;
    this._dataVersion = 0;
    this._callback = callback;
    this.job = job;
    this.get_url = get_url;
    this.new_last_id = '';
    this.size = page_size;
    this.no_more = false;
    this.columns = [];
    this.accessToken = accessToken;

    this.getDataStore(job, get_url, true, null, accessToken);
  }

  getDataStore(job, get_url, first, resolve, accessToken) {
    if (first) {
      axios
        .get(get_url, {
          headers: { Authorization: 'Bearer ' + accessToken }
        })
        .then(response => {
          if (response.data.success) {
            let results = response.data.results;
            this.new_last_id = response.data.new_last_id;
            this.size = response.data.count;
            this.no_more = response.data.no_more;
            this.columns = response.data.columns;
            this._dataList = results;
          }
          this._callback(page_size);
        });
    } else {
      axios
        .get(get_url + '?last_id=' + this.new_last_id, {
          headers: { Authorization: 'Bearer ' + accessToken }
        })
        .then(response => {
          if (response.data.success) {
            let results = response.data.results;
            if (resolve !== null) {
              resolve({
                last_id: response.data.new_last_id,
                no_more: response.data.no_more,
                results: results
              });
            }
          }
        });
    }
  }

  appendResults(results) {
    this._dataList = _.concat(this._dataList, results);
  }

  getDataVersion() {
    return this._dataVersion;
  }

  getSize() {
    return this.size;
  }

  fetchRange(end) {
    if (this._pending) {
      return;
    }

    this._pending = true;
    return new Promise(resolve => {
      this.getDataStore(this.job, this.get_url, false, resolve);
    }).then(res => {
      console.log('done loading data store');
      this._pending = false;
      this._end = end;
      this._dataVersion++;
      this.new_last_id = res.last_id;
      this.no_more = res.no_more;
      this.appendResults(res.results);

      this._callback(end);
    });
  }

  getObjectAt(index) {
    if (index >= this._end) {
      this.fetchRange(Math.min(this.size, index + page_size));
      return null;
    }
    if (this._dataList.length > index) {
      return this._dataList[index];
    }
    return null;
  }
}
