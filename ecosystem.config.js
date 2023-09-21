module.exports = {
  apps : [
  {
    name: "LG_IntegrationDB_prd",
    script: "./dist",
    watch: true,
    merge_logs: true, // 클러스터 모드 사용 시 각 클러스터에서 생성되는 로그를 한 파일로 합쳐준다.
    ignore_watch: [
           "LGE_logs",
           "node_modules"
       ],
    env: {
    NODE_ENV: 'production',
    },
    instances: 1,
    exec_mode: "cluster",
   //tsc
   //post_update: ['npm run build'],
   //log_date_format: "YYYY-MM-DD HH:mm:ss",
   output: "./LGE_logs/pm2/lg_integrationDB.log",
   error: "./LGE_logs/pm2/lg_integrationDB-error.log"
  }
],
};
