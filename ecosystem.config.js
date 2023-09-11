module.exports = {
  apps : [
  {
    name: "LG_IntegrationDB_prd",
    script: "./dist",
    watch: true,
    merge_logs: true, // 클러스터 모드 사용 시 각 클러스터에서 생성되는 로그를 한 파일로 합쳐준다.
    ignore_watch: [
           "logs",
           "node_modules"
       ],
    env: {
    NODE_ENV: 'production',
    },
   instances: 2,
   exec_mode: "cluster",

   //log_date_format: "YYYY-MM-DD HH:mm:ss",
   output: "./logs/pm2/lg_integrationDB.log",
   error: "./logs/pm2/lg_integrationDB-error.log"
  }
],
};
