const createObjectPermission = async (permissions) => {

    // console.log("🚀 ~ AuthController ~ permissionObject ~ permissions:", permissions)
    let parent = permissions.filter(o => o.parent_function_id == null)
    let children = permissions.filter(o => o.parent_function_id != null)
    
    parent.forEach(p => {
        let childItems = children.filter(c => c.parent_function_id === p.function_id);
        
        if (!p.child) {
            p.child = [];
        }
        
        p.child.push(...childItems);
    });

    // console.log("🚀 ~ createObjectPermission ~ parent:", parent)
    return parent
    
}

module.exports = { createObjectPermission }