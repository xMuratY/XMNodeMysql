/*
TODO: Error Handling
*/

var mysql = require('mysql');

this.XMMysql = {
    ShowErrors: true,

    IsInit: false,
    IsConnected: false,

    MysqlObject: null,

    Initialize: function (mysql_server, mysql_username, mysql_password, mysql_database, mysql_connect, ShowErrors, m_Charset)
    {
        if (this.ShowErrors === undefined)
            this.ShowErrors = false;

        this.MysqlObject = mysql.createConnection({
            charset: m_Charset === undefined ? "utf8" : m_Charset,
            host: mysql_server,
            user: mysql_username,
            password: mysql_password,
            database: mysql_database
        });

        this.IsInit = true;

        if (mysql_connect === true)
            return this.Connect();
    },
    Connect: function (callbackfn) {
        if (this.IsInit === false)
            return false;
        this.MysqlObject.connect(function (error) {
            if (error)
                this.IsConnected = false;
            else
                this.IsConnected = true;
            if (callbackfn !== undefined)
                callbackfn(error);
        });
        return true;
    },
    Disconnect: function () {
        this.MysqlObject.ping(function (error) {
            if (error) return;
        });
        this.MysqlObject.destroy();
    },

    Update: function (callbackfn, TableName, RequestArray, Where) {
        var RequestStr = 'UPDATE ' + TableName + ' SET ';
        var axCount = RequestArray.length - 1;
        var axValues = [];
        RequestArray.foreach(function (axObj, index) {
            RequestStr += axObj.key + ' = ?';
            if (index !== axCount)
                RequestStr += ", ";
            axValues.push(axObj.value);
        });
        if (Where !== undefined) {
            RequestStr += ' WHERE ' + Where.key + ' = ?';
            axValues.push(Where.value);
        }
        this.MysqlObject.query(RequestStr, axValues, function (error) {
            if (callbackfn !== undefined)
                callbackfn(error);
        });
    },
    Insert: function (callbackfn, TableName, RequestObject) {
        var RequestStr = 'INSERT INTO ' + TableName + ' SET ?';
        this.MysqlObject.query(RequestStr, RequestObject, function (error) {
            if (callbackfn !== undefined)
                callbackfn(error);
        });
    },
    Select: function (callbackfn, TableName, Where, Selection) {
        var RequestStr = 'SELECT ';
        var apf = Selection === undefined ? '*' : '??';
        RequestStr += apf + ' FROM ??';
        if (Where !== undefined)
            RequestStr += ' WHERE ?? = ?';
        var axReqParamArray = [];
        if (Selection !== undefined)
            axReqParamArray.push(Selection);
        axReqParamArray.push(TableName);
        axReqParamArray.push(Where.key);
        axReqParamArray.push(Where.value);
        this.MysqlObject.query(RequestStr, axReqParamArray, function (error, result) {
            if (callbackfn !== undefined)
                callbackfn(error ? error : result);
        });
    },
    Delete: function (callbackfn, TableName, Where) {
        var axBool = true;
        if (typeof Where.value === "number")
            axBool = false;
        var RequestStr = 'DELETE FROM ' + TableName + ' WHERE ' + Where.key + ' = ' + axBool ? '"' : '' + Where.value + axBool ? '"' : '';
        this.MysqlObject.query(RequestStr, function (error) {
            if (callbackfn !== undefined)
                callbackfn(error);
        });
    },
    Truncate: function (callbackfn, TableName) {
        var RequestStr = 'TRUNCATE TABLE `' + TableName + '`';
        this.MysqlObject.query(RequestStr, function (error) {
            if (callbackfn !== undefined)
                callbackfn(error);
        });
    },
    CleanStr: function (str) {
        return this.MysqlObject.escape(str);
    }
};
