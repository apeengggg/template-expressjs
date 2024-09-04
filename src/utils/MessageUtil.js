const MessageList = []
MessageList['not.found.in.master'] = '{0} : [{1}] not found in database'
MessageList['not.found.in.master.0'] = '{0} not found in database'
MessageList['found.duplicate'] = 'Found duplicate {0} : [{1}]'
MessageList['found.duplicate.0'] = 'Found duplicate {0}'

String.prototype.format = function(args) {
    var str = this
    return str.replace(String.prototype.format.regex, function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1))
        var replace
        if (intVal >= 0) {
            replace = args[intVal]
        } else if (intVal === -1) {
            replace = "{"
        } else if (intVal === -2) {
            replace = "}"
        } else {
            replace = ""
        }
        return replace
    })
}
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g")

const GetMsg = (code, ...param) => {
    return MessageList[code].format(param)
}

module.exports = { 
    GetMsg,
    unauthorizedAccessWilayah() {
        return 'Tidak memiliki hak akses karena beda wilayah'
    }, 
    cannotEmpty(field) {
        return `${field} harus diisi`
    },
    notFoundInMasterMsg(param) {
        return GetMsg('not.found.in.master.0', param)
    },
    dataFound() {
        return 'Data ditemukan'
    },
    dataNotFound() {
        return 'Data tidak ditemukan'
    },
}