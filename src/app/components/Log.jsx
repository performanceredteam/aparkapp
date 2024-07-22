function Log(User, LogString, Token){

    const saveLog = async e =>{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/log/`, {
            method: 'POST',
            body: JSON.stringify({'lg_usuario': User, 'lg_log': LogString}),
            headers:{
                "Authorization" : `Token ${Token}`,
                "Content-Type":"application/json",
            }
        })

        const data = await res.json()
    
        console.log(data.Message)
    }

    saveLog()
}

export default Log