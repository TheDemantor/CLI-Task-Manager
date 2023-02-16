const fs = require('fs');

//help function executes the command without any arguments, or with a single argument help and prints the CLI usage.
function help(){ 
console.log( `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics` 
);}

//ls function can be used to see all the items that are not yet complete, in ascending order of priority.
function ls(){ 
    if(!fs.existsSync('./task.txt')  )
    {
        console.log(`There are no pending tasks!`);
        return;
    }
    //reading pending tasks
    let pending = fs.readFileSync('./task.txt',{encoding:'utf8', flag:'r'});
    let tasks=pending.split('\n');

    for(i=0;i<tasks.length-1;i++)  
        console.log((i+1)+". "+tasks[i]); 
}

//Function to add any new task with its priority. It insert the task in sorted accending order.   
function add(){ 
    if(process.argv[3]==undefined)
    {
        console.log("Error: Missing tasks string. Nothing added!");
        return;
    }
    let taskName=process.argv[4];
    let priority=process.argv[3];
    let map1=new Map([]);
    //Adding task to task.txt
    fs.writeFileSync("task.txt",taskName+" ["+priority+"]"+"\n", {flag: "a+"}); 
    console.log(`Added task: "`+taskName+`" with priority `+priority);
    //New task added 
    
    //sort and rewrite task.txt
    let pending = fs.readFileSync('./task.txt',{encoding:'utf8', flag:'r'});//reading task.txt
    fs.writeFileSync("./task.txt", "", {flag: "w+"});
    let tasks=pending.split('\n');
    for(i=0;i<tasks.length;i++)
    {   
        let line=tasks[i].split('[');
        if(line[1]!=undefined)
        map1.set(line[1].split(']')[0],line[0]);
    }
    //following line will sort map on the basis of key
    map1 = new Map([...map1.entries()].sort());
    //To write back sorted tasks
    map1.forEach((values,keys)=>{ 
        let entry=values+"["+keys+"]"+"\n";
        fs.writeFileSync("task.txt", entry, {flag: "a+"});
    })
}

//del function is to remove an item by its index.
function del(){ 
    if(process.argv[3]==undefined)
    {
        console.log("Error: Missing NUMBER for deleting tasks.");
        return;
    }
    let ind=process.argv[3];
    let pending = fs.readFileSync('./task.txt',{encoding:'utf8', flag:'r'});
    let tasks=pending.split('\n');
    //Following if checks if the task with index ind exists
    if(ind>tasks.length-1||ind==0) 
    {
        console.log(`Error: task with index #${ind} does not exist. Nothing deleted.`);
        return;
    }
    //removing task at index ind
    tasks.splice(ind-1,1); 
    console.log(`Deleted task #${ind}`);
    let newString="";
    for(i=0;i<tasks.length;i++)
    {   
        newString+=tasks[i];
        if(i<tasks.length-1)
        newString+='\n';
    }
    fs.writeFileSync("./task.txt", "", {flag: "w+"});
    //newString is the string of tasks after removing the item at index ind.
    fs.writeFileSync("task.txt", newString, {flag: "a+"}); 
}

//This done function will mark an item as completed by its index, and shift the item from task list to completed list.
function done(){ 
    if(process.argv[3]==undefined)
    {
        console.log("Error: Missing NUMBER for marking tasks as done.");
        return;
    }
    let ind=process.argv[3]; 
    let pending = fs.readFileSync('./task.txt',{encoding:'utf8', flag:'r'});
    let tasks=pending.split('\n');
    if(ind>tasks.length-1||ind==0) // checking if such a task exists
    {
        console.log(`Error: no incomplete item with index #${ind} exists.`);
        return;
    }
    let name=(tasks[ind-1].split(' [')); // if found then appended in completed.txt without priority
    fs.writeFileSync("completed.txt", (name[0]+"\n"), {flag: "a+"});
    tasks.splice(ind-1,1); //removing that task from task.txt
    let newString="";
    for(i=0;i<tasks.length;i++)
    {   
        newString+=tasks[i];
        if(i<tasks.length-1)
        newString+='\n';
    }
    fs.writeFileSync("./task.txt", "", {flag: "w+"});
    // updating task.txt
    fs.writeFileSync("task.txt", newString, {flag: "a+"});
    console.log("Marked item as done.");
}

//This function shows the number of complete and incomplete items in the list. And also displays the task pending and completed.
function report(){ 
    let data1 = fs.readFileSync('./task.txt',{encoding:'utf8', flag:'r'});
    let pending=data1.split('\n');  //array of pending tasks
    let data2 = fs.readFileSync('./completed.txt',{encoding:'utf8', flag:'r'});
    let completed=data2.split('\n');  //array of completed tasks
    console.log("Pending : "+(pending.length-1));
    for(i=0;i<pending.length-1;i++) 
        console.log((i+1)+". "+pending[i]);
    
    console.log("\nCompleted : "+(completed.length-1));
    for(i=0;i<completed.length-1;i++)  
        console.log((i+1)+". "+completed[i]);
}

//This object holds all the valid commands.
const command = { 
    'undefined': () => help(),
    'help': () => help(),
    'add': () => add(),
    'ls': () => ls(),
    'del': () => del(),
    'done': () => done(),
    'report': () => report(),
    'default': () => console.log("Please enter a valid command. You can take help by running the file without arguments or by typing ./task help\n")
};
  
(command[process.argv[2]]||command['default'])();