import {writeFile, readFile, DownloadDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import {theme} from '../constants/theme';

export const getSecondPart = str => {
  if (str.includes('does not include group expenses')) {
    return str.split(
      '1<table><tr><td data-t="s" data-v="Note: does not include group expenses" id="sjs-A1">Note: does not include group expenses</td>',
    )[1];
  } else {
    return str;
  }
};

export const readFileFromUri = ({uri, callback, navigation}) => {
  //   console.warn(uri);
  readFile(uri, 'ascii')
    .then(res => {
      const wb = XLSX.read(res, {type: 'binary'});
      //   console.warn(wb);
      const wsName = wb.SheetNames[0];
      // console.warn(wsName);
      const ws = wb.Sheets[wsName];
      // console.warn(ws);
      const data = XLSX.utils.sheet_to_html(ws, {header: 1});

      // const data = XLSX.utils.sheet_to_json(ws, {header: 1}); // TO manage with json data structure

      // var temp = [];
      // for (let i = 0; i < data.length; i++) {
      //   temp.push({
      //     Date: data[i][0],
      //     Category: data[i][1],
      //     Cost: data[i][2],
      //     Currency: data[3][0],
      //     Avinash: data[i][4],
      //     Anu: data[i][5],
      //   });
      //   i === data.length - 1 && callback(data);
      // }

      // console.warn(data);
      callback(data);
      navigation.navigate('CsvScreen', {data: getSecondPart(data)});
    })
    .catch(err => console.error(err));
};
