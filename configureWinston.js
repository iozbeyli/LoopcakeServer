module.exports = function (winston) {
   // Add log files
   const config = {
      timestamp: function() {
        return Date.now();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return new Date(options.timestamp()) +' '+ options.level +': '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta, null, 2) : '' );
      }
   };

   // TODO: circular log files, 
   //       streaming
   //       level-based transports
   winston.configure({
      transports: [
         new winston.transports.Console(config),
         new winston.transports.File({filename: 'winston.log'})
      ]
   })
}
