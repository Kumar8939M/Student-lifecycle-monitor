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

export function createTracker(){
    db.transaction((tx)=>{
        const query = "create TABLE if not EXISTS tracker (id varchar(255),score integer, firstweek varchar(255),secondweek varchar(255),thirdweek varchar(255),first integer,second integer, third integer)"
        tx.executeSql(query)
    },(error)=>{
        console.log(error.message);
    },()=>{
        console.log("Created Tracker");
        insertTracker()
    })
}

function insertTracker(){
    db.transaction((tx)=>{
        var query = "SELECT * FROM tracker"
        tx.executeSql(query,[],
            (_,{rows})=>{
                if(rows.length===0){
                    query = `INSERT INTO tracker values ("1234",0,"","","",0,0,0)`
                    tx.executeSql(query)
                }
            }
        )
    },(error)=>{
        console.log(error.message);
    },()=>{console.log("Inserted");})
}

export function updateTrackerScore(){
    db.transaction((tx)=>{
        var query = `SELECT * FROM tracker where id=?`
        tx.executeSql(query,["1234"],(_,{rows})=>{
            let score = rows._array[0].score;
            score = score+2
            query = `UPDATE tracker SET score=? WHERE id=?`
            tx.executeSql(query,[score,"1234"])
        })
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated Score");})
}

export function updateTracker(field,value){
    db.transaction((tx)=>{
        const query = `UPDATE tracker SET ${field}=? WHERE id=1234`
        tx.executeSql(query,[value])
    },(error)=>{
        console.log(error);
    },()=>{console.log("Updated");})
}

export function getTracker(setTracker){
    db.transaction((tx)=>{
        const query = "SELECT * FROM tracker"
        tx.executeSql(query,[],
            (_,{rows})=>{
                if(rows._array.length===0){
                    insertTracker();
                    getTracker(setTracker);
                    return;
                }
                let data = rows._array[0]
                console.log(rows._array);
                data.firstweek = new Date(data.firstweek)
                data.secondweek = new Date(data.secondweek)
                data.thirdweek = new Date(data.thirdweek)
                setTracker(data)
            }
        )
    },(error)=>{
        console.log(error.message);
       createTracker()
       getTracker(setTracker)
    },()=>{
        console.log("success");
    })
}

export function deleteTracker(id){
    db.transaction((tx)=>{
        var query = "DELETE FROM tracker WHERE id=?"
        tx.executeSql(query,[id])
    })
}
