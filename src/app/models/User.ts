export interface User {
    id : number;
    prefijo:string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoUsuario: number;
    departamentoId: number;
    email : string;
    password : string;
    token : string;
    img:string;
    comments:string;
    rol:string;
}