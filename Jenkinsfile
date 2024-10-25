pipeline {
    agent any
    tools {
        nodejs 'nodejs_20_17_0' // Configura la versión de Node.js instalada en Jenkins
    }
    stages {
        stage('Install Dependencies') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/NicolasAMunozR/TingesoLab1-Frontend']])
                bat 'npm install' // Usa 'bat' para Windows o 'sh' para Linux/Mac
            }
        }

        stage('Build Project') {
            steps {
                bat 'npm run build' // Genera la versión de producción del frontend
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat 'docker build -t t-toto104/frontend:latest .' // Construye la imagen Docker
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'T_Toto104', variable: 'dhpsw')]) {
                        bat 'docker login -u t-toto104 -p %dhpsw%'
                    }
                    bat 'docker push t-toto104/frontend:latest'
                }
            }
        }
    }
}
