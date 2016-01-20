#Build: docker build -t <%=appName%>/nginx .
#Run: docker run -p 80:80 --name <%=appName%> -d <%=appName%>/nginx
FROM nginx
COPY dist/web /usr/share/nginx/html