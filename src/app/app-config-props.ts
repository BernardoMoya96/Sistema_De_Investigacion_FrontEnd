export class AppConfig {
    public static HTTP_HOST : string = "localhost";
    public static HTTP_PORT :string = "9180";
    public static HTTP_CONTEXT :string  = "sirms";

    public static COOKIE_KEY : string = "appCurrentUser" ;

    public static BASE_URL:string  =  "http://" + AppConfig.HTTP_HOST + ":" + AppConfig.HTTP_PORT + "/" + AppConfig.HTTP_CONTEXT;
    // web-tesis frontend enpoint
    public static LOGIN_URL:string = "http://localhost/sistema_investigacion/login";
}