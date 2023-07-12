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

export function createNotepad(){
    db.transaction((tx)=>{
        const query = "CREATE TABLE if not EXISTS notepad (id varchar(255) PRIMARY KEY, title varchar(255), desc varchar(255), updated varchar(255), images varchar[255], links varchar[255], size varchar[255], color varchar[255], font varchar[255],star boolean)"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Notepad");
    })
}

export function insertNote(todo){
    db.transaction((tx)=>{
        console.log(todo);
        if(typeof todo.images==="object"){
            todo.images=todo.images.toString();
        }
        const query = "INSERT INTO notepad VALUES (?,?,?,?,?,?,?,?,?,?)"
        tx.executeSql(query,[todo.id,todo.title,todo.desc,todo.updated,todo.images,todo.links,todo.size,todo.color,todo.font,todo.star])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Inserted");})
}

export function updateNote(id,field,value){
    db.transaction((tx)=>{
        const query = `UPDATE notepad SET ${field}=${value} WHERE id=?`
        tx.executeSql(query,[id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function updateNoteAll(id,todo){
    db.transaction((tx)=>{
        if(typeof todo.images==="object"){
            todo.images=todo.images.toString();
        }
        const query = `UPDATE notepad SET title=?, desc=?, updated=?, images=?, links=?, size=?, color=?, font=?, star=? WHERE id=?`
        tx.executeSql(query,[todo.title,todo.desc,todo.updated,todo.images,todo.links,todo.size,todo.color,todo.font,todo.star,id])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function getNote(setNotes){
    db.transaction((tx)=>{
        const query = "SELECT * FROM notepad"
        tx.executeSql(query,[],
            (_,{rows})=>{
                rows._array.map((data)=>{
                    data.star = (data.star===1)
                    if(!data.images.trim()){
                        console.log("Converting");
                        data.images = []
                    }else{
                        data.images = data.images.split(",");
                    }
                    console.log(data);
                    setNotes((pre)=>[...pre,data])
                })
            }
        )
    },(error)=>{
        console.log(error.message);
       createNotepad()
       getNote(setNotes)
    },()=>{
        console.log("success");
    })
}

export function deleteNotepad(id){
    db.transaction((tx)=>{
        var query = "DELETE FROM notepad WHERE id=?"
        tx.executeSql(query,[id])
    })
}
