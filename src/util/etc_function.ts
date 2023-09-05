import moment from 'moment';

export function yesterday_getDateTime(){

    // let today = moment().format("YYYY-MM-DD");
    let start: string = moment().add("-1","d").format("YYYY-MM-DD"); 
    start = moment(start).format("YYYY-MM-DD");
    let end: string = moment().format("YYYY-MM-DD"); 
    end = moment(end).format("YYYY-MM-DD");

    return {
        start, 
        end
    }
}

export function matchFieldValues(data: any, id: string) {
    return data.fieldValues.map((fv: any) => {
        if(fv.id === id)
            return fv.value; // 값이 없으면 undefined로 return
    })
}

