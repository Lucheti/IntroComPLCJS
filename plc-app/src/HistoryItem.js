import React from 'react'

export const History = ({data, visible}) => {
  return(
    <div className={ ' bordered ' +  (visible ? 'show' : 'hidden')}>
      <ul>
        <hr/>
        {
          data.history && data.history.length && data.history.map( value =>
          <HistoryItem value={value}/>
        )
        }
      </ul>
    </div>
  )
}

const HistoryItem = ({value}) => {

  if (!value){
    return <div> No hay historial </div>
  }

  return(
    <div>
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <code>{value.value? 'On': 'Off'}</code>
        <code>{parseTimestamp(value.timeStamp)}</code>
      </div>
      <hr/>
    </div>
  )
}

const parseTimestamp = (time) => {
  var a = new Date(time);
  var year = a.getFullYear();
  var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


