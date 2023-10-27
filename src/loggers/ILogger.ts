export interface ILogger {
    log (...params: (string | any)[])
    warn (...params: (string | any)[])
    error (...params: (string | any)[])
    info (...params: (string | any)[])
}
