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
        if (ShowErrors === undefined)
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
    DestroySelf: function ()
    {
        this.Disconnect();
        this.XMMysql = undefined; //daf
    },
    Connect: function () {
        if (this.IsInit === false)
            return false;
        this.MysqlObject.connect(function (error) {
            if (error)
                return false;
            this.IsConnected = true;
            return true;
        });
    },
    Disconnect: function () {
        this.MysqlObject.ping(function (error) {
            if (error) return;
        });
        this.MysqlObject.destroy();
    },

    Update: function (TableName, RequestArray, Where) {
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
        this.MysqliObject.query(RequestStr, axValues, function (error) {
            if (error)
                return false;
            return true;
        });
    },
    Insert: function (TableName, RequestObject) {
        var RequestStr = 'INSERT INTO ' + TableName + ' SET ?';
        this.MysqliObject.query(RequestStr, RequestObject, function (error) {
            if (error)
                return false;
            return true;
        });
    },
    Select: function (TableName, Where, Selection) {
        var RequestStr = 'SELECT '+ Selection === undefined ? '*' : '??' +' FROM ??';
        if (Where !== undefined)
            RequestStr += ' WHERE ?? = ?';
        var axReqParamArray = [];
        if (Selection !== undefined)
            axReqParamArray.push(Selection);
        axReqParamArray.push(TableName);
        axReqParamArray.push(Where.key);
        axReqParamArray.push(Where.value);
        this.MysqliObject.query(RequestStr, axReqParamArray, function (error, result) {
            if (error)
                return false;
            return result;
        });
    },
    Delete: function (TableName, Where) {
        var axBool = true;
        if (typeof Where.value === "number")
            axBool = false;
        var RequestStr = 'DELETE FROM ' + TableName + ' WHERE ' + Where.key + ' = ' + axBool ? '"' : '' + Where.value + axBool ? '"' : '';
        this.MysqliObject.query(RequestStr, function (error) {
            if (error)
                return false;
            return true;
        });
    },
    Truncate: function (TableName) {
        var RequestStr = 'TRUNCATE TABLE `' + TableName + '`';
        this.MysqliObject.query(RequestStr, function (error) {
            if (error)
                return false;
            return true;
        });
    },
    CleanStr: function (str) {
        return this.MysqliObject.escape(str);
    }
};
