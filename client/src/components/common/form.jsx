function CommonForm({formControls}) {

    function renderInputsByComponentTypes(controlItem){
        let element = null
    }
    return (

        <form>
            <div className="flex flex-col gap-3">
                {
                    formControls.map((controlItem) =><div className = "grid w-full gap-1.5" key = {controlItem.name}>
                        <label  className = "mb-1">{controlItem.label}</label>
                        {
                            renderInputsByComponentTypes(controlItem)
                        }
                    </div>)
                }
            </div>
        </form>
    )
}


export default CommonForm