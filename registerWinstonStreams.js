module.exports = function (winston, streams, start=-1) {
   winston.stream({start: start}).on('log', log => {
      for (let i = 0; i < streams.length; i++) {
         streams[i](log)
      }
   })
}
