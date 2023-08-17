import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(arr: any, args: any[]): any {
        let search = args[0];
        let field1 = args[1];
        let field2 = args[2];
        let field3 = args[3];
        console.log('~ filter', search, field1)
        if(!arr || !search){
            return arr;
        }
        return arr.filter(item=>{
           return  item[field1].toLowerCase().includes(search.toLowerCase()) ||
           item[field2].toLowerCase().includes(search.toLowerCase()) ||
           item[field3].toLowerCase().includes(search.toLowerCase()) 
        })
    }
}







