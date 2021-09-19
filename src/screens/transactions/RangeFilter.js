export const rangeFilter = (startDate, endDate, entryDate) => {
    const sDay = startDate.getDate();
    const sMonth = startDate.getMonth();
    const sYear = startDate.getFullYear();

    const eDay = endDate.getDate();
    const eMonth = endDate.getMonth();
    const eYear = endDate.getFullYear();

    const entryDay = entryDate.getDate();
    const entryMonth = entryDate.getMonth();
    const entryYear = entryDate.getFullYear();

    if(entryYear < sYear || entryYear > eYear) {
        console.log('returing false > entryYear < sYear || entryYear > eYear');
        return false;
    }
    else {
        if(entryYear === sYear) {
            if(entryMonth < sMonth || (entryMonth === sMonth && entryDay < sDay)) {
                console.log('returing false > entryMonth < sMonth || (entryMonth === sMonth && entryDay < sDay');
                return false;
            }
        }
        if(entryYear === eYear) {
            if(entryMonth > eMonth || (entryMonth === eMonth && entryDay > eDay)) {
                console.log(`returing false here > entryMonth=${entryMonth}, eMonth=${eMonth}, entryDay=${entryDay}, eDay=${eDay}`);
                return false;
            }
        }
        return true;
    }
}