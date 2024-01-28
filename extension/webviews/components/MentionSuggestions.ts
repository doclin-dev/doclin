

const getCurrentOrganizationUsers = () => {
    tsvscode.postMessage({ type: "getCurrentOrganizationUsers", value: "" });
}

// async function suggestPeople(searchTerm: string) {
//     const allPeople = getCurrentOrganizationUsers();
//     return allPeople.filter(person => person.value.includes(searchTerm));
// }