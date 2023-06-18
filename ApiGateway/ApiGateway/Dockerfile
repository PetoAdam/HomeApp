FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["ApiGateway/ApiGateway.csproj", "ApiGateway/"]
RUN dotnet restore "ApiGateway/ApiGateway.csproj"
COPY . .
WORKDIR "/src/ApiGateway"
RUN dotnet build "ApiGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ApiGateway.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ADD /etc/letsencrypt/archive/homeapp.ddns.net/fullchain1.pem /app/publish/fullchain.pem
ADD /etc/letsencrypt/archive/homeapp.ddns.net/privkey1.pem /app/publish/privkey.pem


ENV HTTPS_PEM=/app/publish/fullchain.pem
ENV HTTPS_KEY_PEM=/app/publish/privkey.pem
EXPOSE 5000
EXPOSE 5001
ENTRYPOINT ["dotnet", "ApiGateway.dll"]
