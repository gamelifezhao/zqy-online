pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'jenkins-test'
        CONTAINER_NAME = 'jenkins-test'
        HOST_PORT = '80'
        CONTAINER_PORT = '80'
        DOMAIN = 'zqylife.online'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        
        stage('Deploy') {
            steps {
                // 停止并删除旧容器
                sh 'docker stop $CONTAINER_NAME || true'
                sh 'docker rm $CONTAINER_NAME || true'
                
                // 启动新容器
                sh 'docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT $DOCKER_IMAGE'
            }
        }
        
        stage('Health Check') {
            steps {
                // 等待应用启动
                sh 'sleep 10'
                
                // 检查应用是否响应
                sh 'curl -f http://localhost:$HOST_PORT || exit 1'
            }
        }
    }
    
    post {
        success {
            echo "Deployment successful! Site available at http://${env.DOMAIN}"
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
