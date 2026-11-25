using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace MySistem.Services;

public class TwilioService : ITwilioService
{
    private readonly IConfiguration _config;
    private readonly ILogger<TwilioService> _logger;

    public TwilioService(IConfiguration config, ILogger<TwilioService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> EnviarAlertaStockMinimoAsync(string productoNombre, string sedeNombre, int stockActual)
    {
        try
        {
            var accountSid = _config["TwilioSettings:AccountSid"];
            var authToken = _config["TwilioSettings:AuthToken"];
            var fromNumber = _config["TwilioSettings:FromWhatsAppNumber"];
            var toNumber = _config["TwilioSettings:AdminPhoneNumber"];

            // Modo simulado si aún no están las credenciales reales de Twilio
            if (string.IsNullOrEmpty(accountSid) || accountSid.StartsWith("AC_TU"))
            {
                _logger.LogWarning("Twilio en modo simulado: Stock crítico ({0} uds) en {1} ({2})",
                    stockActual, productoNombre, sedeNombre);
                return await Task.FromResult(true);
            }

            TwilioClient.Init(accountSid, authToken);

            var mensajeCuerpo = $"⚠️ ALERTA DE STOCK MÍNIMO - QBA SAC\n\n" +
                                $"📦 Producto: {productoNombre}\n" +
                                $"📍 Sede: {sedeNombre}\n" +
                                $"📉 Stock restante: {stockActual} unidades\n\n" +
                                $"🔔 Acción requerida: Realizar pedido de reposición urgente.";

            var message = await MessageResource.CreateAsync(
                body: mensajeCuerpo,
                from: new PhoneNumber(fromNumber),
                to: new PhoneNumber(toNumber)
            );

            _logger.LogInformation("Mensaje enviado con éxito. SID: {0}", message.Sid);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar notificación de stock vía Twilio");
            return false;
        }
    }

    Task ITwilioService.EnviarAlertaStockMinimoAsync(string nombreProducto, string nombreSede, int cantidadActual)
    {
        return EnviarAlertaStockMinimoAsync(nombreProducto, nombreSede, cantidadActual);
    }
}

public interface ITwilioService
{
    Task EnviarAlertaStockMinimoAsync(string nombreProducto, string nombreSede, int cantidadActual);
}