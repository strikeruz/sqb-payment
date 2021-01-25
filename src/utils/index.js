export const toggleElClass = (index, selectorsArr = [], activeClassName) => {
    selectorsArr.forEach(el => {
        Array.from(document.querySelectorAll(el)).forEach(e => e.classList.remove(activeClassName))
        document.querySelectorAll(el)[index].classList.add(activeClassName)
    })
}

export function getNumYear() {
   return `${new Date().getFullYear()}`.split('').splice(2, 2).join('')
}

// Pure functions
export function capitalize(string) {
    if (typeof string !== 'string') {
      return ''
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
export function range(start, end) {
  if (start > end) {
    [end, start] = [start, end]
  }
  return new Array(end - start + 1)
      .fill('')
      .map((_, index) => start + index)
}

export function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
  localStorage.setItem(key, JSON.stringify(data))
}

export function isEqual(a, b) {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return a === b
}

export function camelToDashCase(str) {
  return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}

export function toInlineStyles(styles = {}) {
  return Object.keys(styles)
      .map(key => `${camelToDashCase(key)}: ${styles[key]}`)
      .join(';')
}

export function debounce(fn, wait) {
  let timeout
  return function(...args) {
    const later = () => {
      clearTimeout(timeout)
      // eslint-disable-next-line
      fn.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function formToJSON( elem ) {
  let output = {};
  new FormData( elem ).forEach(
    ( value, key ) => {
      value = value.replace(/\s|\//g, '')
      if(key == 'sender_expire') {
        value = value.split('').slice(2).join('') + value.split('').slice(0, 2).join('')
      }
      if(key == 'amount') {
        value = +value * 100
      }

      // Check if property already exist
      if ( Object.prototype.hasOwnProperty.call( output, key ) ) {
        let current = output[ key ];
        if ( !Array.isArray( current ) ) {
          // If it's not an array, convert it to an array.
          current = output[ key ] = [ current ];
        }
        current.push( value ); // Add the new value to the array.
      } else {
        output[ key ] = value;
      }
    }
  );
  return JSON.parse(JSON.stringify( output ));
}

export function getNumberWithSpace(input) {
  let output = parseInt(input).toString()
  return output.replace(/\D/g, '').replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/g, ' ')
}

export function getBrowserName() {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1 ) {
    return 'Opera';
  }else if (navigator.userAgent.indexOf('Chrome') !== -1 ){
    return 'Chrome';
  }else if (navigator.userAgent.indexOf('Safari') !== -1){
    return 'Safari';
  }else if (navigator.userAgent.indexOf('Firefox') !== -1 ) {
    return 'Firefox';
  } else {
    return 'unknown';
  }
}


export function countdownTimer( elementName, minutes, seconds, callback )
{
    let element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            callback()
            element.innerHTML = "0:00";
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}