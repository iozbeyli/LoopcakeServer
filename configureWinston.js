/**
   winston: imported winston logger
   streams: undefined or an array of callbacks
            taking logs as the arguments
*/
module.exports = function (winston, path='logs') {
   require('winston-daily-rotate-file');
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

   function createRotateFile(level) {
      return new winston.transports.DailyRotateFile({
         filename: path + '/' + level + '.log',
         datePattern: 'yyyy-MM-dd.',
         prepend: true,
         level: level,
         name: 'rf_' + level
      })
   }
   const transports = [new winston.transports.Console(config)]
   const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly' ]

   for (let i = 0; i < levels.length; i++) {
      transports.push(createRotateFile(levels[i]));
   }
   winston.configure({
      transports: transports/*[
         new winston.transports.Console(config),

         new winston.transports.DailyRotateFile({
            filename: './err.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'error',
            name: 'rf'
         }),
         new winston.transports.DailyRotateFile({
            filename: './err.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'error',
            name: 'rf2'
         })
      ]*/
   });


}
