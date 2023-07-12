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

export function createAssignment(){
    db.transaction((tx)=>{
        const query = "CREATE TABLE if not EXISTS assignment (id varchar(255) PRIMARY KEY, name varchar(255), description varchar(255), due varchar(255), priority boolean, reminder boolean, progress integer,notificationid varchar(255))"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created assignment");
    })
}

export function insertAssignment(assignment){
    db.transaction((tx)=>{
        const query = "INSERT INTO assignment VALUES (?,?,?,?,?,?,?,?)"
        tx.executeSql(query,[assignment.id,assignment.name,assignment.description,assignment.due,assignment.priority,assignment.reminder,assignment.progress,assignment.notificationid])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Inserted");})
}

export function updateAssignment(id,field,value){
    console.log(id,field,value);
    db.transaction((tx)=>{
        const query = `UPDATE assignment SET ${field}=${value} WHERE id=?`
        tx.executeSql(query,[id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateAssignmentAll(id,assignment){
    console.log(assignment);
    db.transaction((tx)=>{
        const query = `UPDATE assignment SET name=?, description=?, due=?, priority=?, reminder=?, progress=?, notificationid=? WHERE id=?`
        tx.executeSql(query,[assignment.name,assignment.description,assignment.due,assignment.priority,assignment.reminder,assignment.progress,assignment.notificationid,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function getAssignment(setAssignmentItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM assignment"
        tx.executeSql(query,[],
            (_,{rows})=>{
                rows._array.map((data)=>{
                    data.priority = (data.priority===1)
                    data.reminder = (data.reminder===1)
                    data.due = new Date(data.due);
                    data.notificationid = data.notificationid.split(",");
                    console.log(data);
                    setAssignmentItems((pre)=>[...pre,data])
                })
            }
        )
    },(error)=>{
        console.log(error.message);
        createAssignment()
        getAssignment(setAssignmentItems)
    },(success)=>{
        console.log("success");
    })
}

export function deleteAssignment(id){
    db.transaction((tx)=>{
        var query = "DELETE FROM assignment WHERE id=?"
        tx.executeSql(query,[id])
    })
}

function difference(date1,date2){
    // let diff = date1.due.getTime()-date2.due.getTime()
    // let remainingDays = (Math.ceil(diff / (1000 * 3600 * 24)));
    return (new Date(date1.due).setHours(0, 0, 0, 0) - new Date(date2.due).setHours(0, 0, 0, 0))
}

export function getAssignmentHome(setAssignmentItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM assignment"
        tx.executeSql(query,[],
            (_,{rows})=>{
                let assignments = []
                rows._array.map((data)=>{
                    data.priority = (data.priority===1)
                    data.reminder = (data.reminder===1)
                    data.due = new Date(data.due);
                    data.notificationid = data.notificationid.split(",");
                    console.log(data);
                    assignments.push(data)
                })
                assignments.sort(difference)
                console.log(assignments);
                setAssignmentItems(assignments)
            }
        )
    },(error)=>{
        console.log(error.message);
        createAssignment()
        getAssignment(setAssignmentItems)
    },()=>{
        console.log("success");
    })
}
