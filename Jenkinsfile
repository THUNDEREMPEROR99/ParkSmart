pipeline {
    agent any

    environment {
        IMAGE_NAME = 'akankshmahesh/parksmart-app'
        SONAR_SCANNER_HOME = tool 'SonarScanner'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/THUNDEREMPEROR99/ParkSmart.git', branch: 'main'
            }
        }

        stage('Git Version Check') {
            steps {
                bat 'git --version'
                bat 'git log --oneline -5'
            }
        }

        stage('Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'py -m pip install -r requirements.txt'
                }
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    bat """
                        "%SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat" ^
                        -Dsonar.projectKey=THUNDEREMPEROR99_ParkSmart ^
                        -Dsonar.organization=thunderemperor99 ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=https://sonarcloud.io ^
                        -Dsonar.token=%SONAR_TOKEN%
                    """
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                bat 'trivy fs . > trivy-report.txt'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %IMAGE_NAME%'
            }
        }

        stage('Deploy Frontend to Vercel') {
            steps {
                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                    dir('frontend') {
                        bat 'npx vercel --prod --token %VERCEL_TOKEN% --yes'
                    }
                }
            }
        }

        stage('Deploy Backend to Render') {
            steps {
                withCredentials([string(credentialsId: 'render-hook', variable: 'RENDER_HOOK')]) {
                    bat 'curl -X POST %RENDER_HOOK%'
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
