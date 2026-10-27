import React from "react";
function Employee(props){
    return(
        <div>
            <h2>Employee Name:{props.name}</h2>
            <h3>Salary:{props.salary}</h3>
        </div>
    );

}
export default Employee;