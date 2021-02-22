export default function useFormFields(fieldList) {
    if(fieldList) {
        const generateListForm = fieldList.reduce((acc, val, index, list) => {
            list[index].fields.forEach(fieldElements => {
                acc.push(fieldElements)
            });
            return acc
        }, [])
        return generateListForm;
    }
    return []
}