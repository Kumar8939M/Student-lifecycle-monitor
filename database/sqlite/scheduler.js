import * as SQLite from "expo-sqlite";


function openDatabase() {
    if (Platform.OS === "web") {
    return {
        transaction: () => {
        return {
            executeSql: () => {},
        };
        },
    };
    }

    const db = SQLite.openDatabase("StudentDB");
    return db;
}
  
const db = openDatabase();

export function createScheduler(){
    db.transaction((tx)=>{
        const query = "CREATE TABLE if not EXISTS schedule (id varchar(255) PRIMARY KEY, name varchar(255), description varchar(255), time varchar(255), repeat boolean, repeatby varchar(255), repeatvalue varchar(255), location varchar(255), priority boolean, notificationid varchar (255), reminder boolean)"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Scheduler");
    })
}

export function insertScheduler(scheduler){
    console.log("here");
    db.transaction((tx)=>{
        const query = "INSERT INTO schedule (id,name,description,time,repeat,repeatby,repeatvalue,location,priority,notificationid,reminder) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        tx.executeSql(query,[scheduler.id,scheduler.name,scheduler.description,scheduler.time,scheduler.repeat,scheduler.repeatby,scheduler.repeatvalue,scheduler.location,scheduler.priority,scheduler.notificationid,scheduler.reminder])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Inserted");})
}

export function updateScheduler(id,field,value){
    db.transaction((tx)=>{
        const query = `UPDATE schedule SET ${field}=${value} WHERE id=?`
        tx.executeSql(query,[id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateSchedulerAll(id,data){
    db.transaction((tx)=>{
        const query = `UPDATE schedule SET name=?, description=?, time=?, repeat=?, repeatby=?,repeatvalue=?, location=?, priority=?, notificationid=?, reminder=? WHERE id=?`
        tx.executeSql(query,[data.name,data.description,data.time,data.repeat,data.repeatby,data.repeatvalue,data.location,data.priority,data.notificationid,data.reminder,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function getScheduler(setScheduleItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM schedule"
        tx.executeSql(query,[],
            (_,{rows})=>{
                console.log(rows._array);
                // setScheduleItems(rows._array)
                rows._array.map((data)=>{
                    data.priority = (data.priority===1)
                    data.reminder = (data.reminder===1)
                    data.repeat = (data.repeat===1)
                    data.time = new Date(data.time);
                    data.notificationid = data.notificationid.split(",");
                    if(data.repeatby==="Day"){
                        data.repeatvalue = data.repeatvalue.toString();
                    }else if(data.repeatvalue==="Date"){
                        data.repeatvalue = new Date(data.repeatvalue)
                    }
                    console.log(data);
                    setScheduleItems((pre)=>[...pre,data])
                })
            }
        )
    },(error)=>{
        console.log(error.message);
        createScheduler();
        getScheduler(setScheduleItems);
    },(success)=>{
        console.log("success");
    })
}

export function deleteScheduler(id){
    db.transaction((tx)=>{
        var query = "DELETE FROM schedule WHERE id=?"
        tx.executeSql(query,[id])
    })
}

function difference(date1,date2){
    let diff = date2.time.getTime()-date1.time.getTime()
    let remainingDays = (Math.ceil(diff / (1000 * 3600 * 24)));
    return (remainingDays)
}

export function getSchedulerHome(setScheduleItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM schedule"
        tx.executeSql(query,[],
            (_,{rows})=>{
                let schedules = []
                rows._array.map((data)=>{
                    data.priority = (data.priority===1)
                    data.reminder = (data.reminder===1)
                    data.repeat = (data.repeat===1)
                    data.time = new Date(data.time);
                    data.notificationid = data.notificationid.split(",");
                    if(data.repeatby==="Day"){
                        data.repeatvalue = data.repeatvalue.toString();
                    }else if(data.repeatvalue==="Date"){
                        data.repeatvalue = new Date(data.repeatvalue)
                    }
                    schedules.push(data)
                })
                schedules.sort(difference);
                console.log(schedules);
                setScheduleItems(schedules)
            }
        )
    },(error)=>{
        console.log(error.message);
        createScheduler();
        getScheduler(setScheduleItems);
    },(success)=>{
        console.log("success");
    })
}