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

export function createTodoGroup(){
    db.transaction((tx)=>{
        const query = "Create table if not EXISTS todoGroup (id varchar(255) PRIMARY KEY, name varchar(255), color varchar(255),completed boolean,star boolean,groupid varchar(255))"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Todo");
    })
}

export function insertTodoGroup(todo){
    db.transaction((tx)=>{
        const query = "INSERT into todoGroup (id,name,color,completed,star,groupid) VALUES (?, ?, ?, ?, ?, ?)"
        tx.executeSql(query,[todo.id,todo.name,todo.color,todo.completed,todo.star,todo.groupid])
        createTodoGroupTable(todo.groupid)
    },(error)=>{
        console.log(error);
    },()=>{console.log("Inserted");})
}

export function updateTodoGroup(id,todo){
    db.transaction((tx)=>{
        const query = "UPDATE todoGroup SET name=?, color=?, completed=? star=? WHERE id=?"
        tx.executeSql(query,[todo.name,todo.color,todo.completed,todo.star,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateTodoGroupStarred(id,star){
    db.transaction((tx)=>{
        const query = "UPDATE todoGroup SET star=? WHERE id=?"
        tx.executeSql(query,[star,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateTodoGroupLabel(id,name){
    db.transaction((tx)=>{
        const query = "UPDATE todoGroup SET name=? WHERE id=?"
        tx.executeSql(query,[name,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function getTodoGroup(setTaskItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM todoGroup"
        tx.executeSql(query,[],
            (_,{rows})=>{
                console.log(rows._array);
                setTaskItems(rows._array)
            }
        )
    },(error)=>{
        console.log(error.message);
        createTodoGroup();
        getTodoGroup(setTaskItems)
    },(success)=>{
        console.log("success");
    })
}

export function deleteTodoGroup(id,groupid){
    groupid = groupid.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        var query = "DELETE FROM todoGroup WHERE id=?"
        tx.executeSql(query,[id])
        query = `DROP TABLE ${groupid}`
        tx.executeSql(query)
    })
}

export function createTodoGroupTable(name){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `Create table if not EXISTS ${name} (id varchar(255) PRIMARY KEY, name varchar(255), color varchar(255),completed boolean, star boolean, parent varchar(255))`
        tx.executeSql(query)
    },(error)=>{
        console.log(error);
    },()=>{console.log("Created");})
}

export function insertTodoTable(name,todo){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `INSERT into ${name} (id,name,completed,parent) VALUES (?, ?, ?, ?)`
        tx.executeSql(query,[todo.id,todo.name,todo.completed,todo.parent])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Insert");})
}

export function updateTodoTable(id,todo,name){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `UPDATE ${name} SET name=?, color=?, completed=?, star=? WHERE id=?`
        tx.executeSql(query,[todo.name,todo.color,todo.completed,todo.star,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateTodoTableName(id,label,name){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `UPDATE ${name} SET name=? WHERE id=?`
        tx.executeSql(query,[label,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}


export function getTodoTable(setTaskItems,name){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `SELECT * FROM ${name}`
        tx.executeSql(query,[],
            (_,{rows})=>{
                console.log(rows._array);
                setTaskItems(rows._array)
            }
        )
    },(error)=>{
        console.log(error.message);
        createTodoGroupTable(name);
        getTodoTable(setTaskItems,name)
    },()=>{
        console.log("success");
    })
}


export function deleteTodoTable(id,name){
    name = name.replace(/[^a-zA-Z]/g, "")
    db.transaction((tx)=>{
        const query = `DELETE FROM ${name} WHERE id=?`
        tx.executeSql(query,[id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Delete");})
}

export function getTodoGroupHome(setTaskItems){
    db.transaction((tx)=>{
        const query = "SELECT * FROM todoGroup WHERE star=1"
        tx.executeSql(query,[],
            (_,{rows})=>{
                console.log(rows._array);
                console.log(rows._array);
                console.log(rows._array);
                setTaskItems(rows._array)
            }
        )
    },(error)=>{
        console.log(error.message);
        createTodoGroup();
        getTodoGroup(setTaskItems)
    },(success)=>{
        console.log("success");
    })
}